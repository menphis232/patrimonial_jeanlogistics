import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UserService } from 'src/app/core/user/user.service';
import { OfficeSelectService } from './office-select.service';
import { take } from 'rxjs';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-office-select',
  standalone: true,
  imports: [RouterModule, TablerIconsModule, MaterialModule, NgFor, NgIf, NgClass, SharedModule],
  templateUrl: './office-select.component.html',
})
export class OfficeSelectComponent implements OnInit {
  @Input() classContainer = "";
  
  public showCostCenterMenu: boolean = true;
  public costCenterTypeList: any[] = [];
  public costCenterList: any[] = [];
  public listaCentrocosto: any[] = [];

  constructor(
    private _userService: UserService,
    private _officeSelectService: OfficeSelectService,
  ) { }

  get costCenterTypeSelected$() {
    return this._officeSelectService.costCenterType$;
  }

  get costCenterSelected$() {
    return this._officeSelectService.costCenter$;
  }

  // Método para verificar si está en modo global
  get isGlobalSelected(): boolean {
    return this._officeSelectService.isGlobalSelected();
  }

  // Método para obtener el texto del botón de tipo
  get typeButtonText(): string {
    if (this.isGlobalSelected) {
      return 'Global';
    }
    const selectedType = this._officeSelectService.getOfficeStorage("costCenterType");
    return selectedType?.description || 'Seleccionar tipo';
  }

  // Método para obtener el texto del botón de centro
  get centerButtonText(): string {
    if (this.isGlobalSelected) {
      return 'Global';
    }
    const selectedCenter = this._officeSelectService.getOfficeStorage("costCenter");
    return selectedCenter?.name || 'Seleccionar centro';
  }

  ngOnInit(): void {
    const User = JSON.parse(this._userService.userStorage);
    this.listaCentrocosto = User.farms || [];
    
    // Cargar los tipos de centros de costo desde el servicio
    this._officeSelectService.getFarmTypes().subscribe(
      (types) => {
        this.costCenterTypeList = types;
        this.setOffceStorage();
      },
      (error) => {
        console.error('Error al cargar los tipos de centros de costo:', error);
        // Fallback: usar farm_type_id de las farms para crear una lista de tipos única
        this.createFarmTypesFromFarms();
      }
    );
  }

  /**
   * Crea la lista de tipos de centros de costo a partir de los farm_type_id en las farms
   */
  createFarmTypesFromFarms() {
    const uniqueTypes = new Map();
    
    this.listaCentrocosto.forEach(farm => {
      if (farm.farm_type_id && !uniqueTypes.has(farm.farm_type_id)) {
        // Buscar si hay alguna granja con la descripción del tipo
        const farmWithSameType = this.listaCentrocosto.find(f => 
          f.farm_type_id === farm.farm_type_id && f.farm_type_description);
        
        uniqueTypes.set(farm.farm_type_id, {
          id: farm.farm_type_id,
          name: farmWithSameType?.farm_type_description || `Tipo ${farm.farm_type_id}`,
          description: farmWithSameType?.farm_type_description || `Tipo ${farm.farm_type_id}`,
          table_name: "farms",
          data: null
        });
      }
    });
    
    this.costCenterTypeList = Array.from(uniqueTypes.values());
    this.setOffceStorage();
  }

  selectGlobalOption() {
    // Implementación de la opción global
    this._officeSelectService.selectGlobalOption();
    // Recargar la página para que tome el estado global
    location.reload();
  }

  setOfficeDefault() {
    // Solo establecer defaults si no está en modo global
    if (this.isGlobalSelected) {
      return;
    }

    // Establecer el tipo por defecto si existe
    const costCenterTypeDefault = this.costCenterTypeList.length > 0 ? this.costCenterTypeList[0] : null;
    
    if (costCenterTypeDefault) {
      // Filtrar las granjas por el tipo seleccionado
      this.costCenterList = this.filterFarmsByType(costCenterTypeDefault.id);
      
      // Seleccionar la primera granja filtrada si existe
      const costCenterDefault = this.costCenterList.length > 0 ? this.costCenterList[0] : null;
      
      // Guardar las selecciones
      this.selectOffice({ keyStorage: "costCenterType", office: costCenterTypeDefault, reload: false });
      
      if (costCenterDefault) {
        this.selectOffice({ keyStorage: "costCenter", office: costCenterDefault, reload: false });
      }
    }
  }

  /**
   * Filtra las granjas por el tipo de centro de costo
   * @param typeId ID del tipo de centro de costo
   * @returns Lista de granjas filtradas
   */
  filterFarmsByType(typeId: number): any[] {
    return this.listaCentrocosto.filter(farm => farm.farm_type_id === typeId);
  }

  setOffceStorage() {
    // Si está en modo global, no establecer valores por defecto
    if (this.isGlobalSelected) {
      return;
    }

    const costCenterType = this._officeSelectService.getOfficeStorage("costCenterType");

    if (!costCenterType?.id) {
      this.setOfficeDefault();
      return;
    }

    // Filtrar las granjas por el tipo seleccionado
    this.costCenterList = this.filterFarmsByType(costCenterType.id);
    const costCenter = this._officeSelectService.getOfficeStorage("costCenter");

    this.selectOffice({ keyStorage: "costCenterType", office: costCenterType, reload: false });
    this.selectOffice({ keyStorage: "costCenter", office: costCenter, reload: false });
  }

  selectOffice({ keyStorage, office, reload }) {
    // Desactivar el modo global cuando se selecciona una opción específica
    this._officeSelectService.setGlobalSelected(false);
    
    this._officeSelectService.setOfficeStorage(office, keyStorage);

    if (keyStorage == "costCenterType") {
      // Actualizar la lista de centros de costo según el tipo seleccionado
      this.costCenterList = this.filterFarmsByType(office.id);
      this._officeSelectService.selectCostCenterType(office);
      
      // Si no hay selección actual o la selección actual no está en la lista filtrada,
      // seleccionar el primer centro de costo de la nueva lista
      const currentCostCenter = this._officeSelectService.getOfficeStorage("costCenter");
      const costCenterExists = this.costCenterList.some(cc => cc.id === currentCostCenter?.id);
      
      if (!costCenterExists && this.costCenterList.length > 0) {
        const defaultCostCenter = this.costCenterList[0];
        this.selectOffice({ keyStorage: "costCenter", office: defaultCostCenter, reload: false });
      }
    }

    if (keyStorage == "costCenter") {
      this._officeSelectService.selectCostCenter(office);
    }

    if (reload) {
      location.reload();
    }
  }

  isCostCenterTypeSelected(costCenterType: any): boolean {
    let isSelected = false;

    this._officeSelectService.costCenterType$.pipe(
      take(1)
    ).subscribe((selectedCostCenterType: any) => {
      isSelected = selectedCostCenterType?.id == costCenterType?.id;
    });

    return isSelected;
  }

  isCostCenterSelected(costCenter: any): boolean {
    let isSelected = false;

    this._officeSelectService.costCenter$.pipe(
      take(1)
    ).subscribe((selectedCostCenter: any) => {
      isSelected = selectedCostCenter?.id == costCenter?.id;
    });

    return isSelected;
  }

  ngOnDestroy(): void {
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
