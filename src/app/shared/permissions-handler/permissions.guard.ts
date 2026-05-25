import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { UserService } from "src/app/core/user/user.service";

export const checkPermissionGuard: CanActivateFn = (route, state) => {
  const _router = inject(Router)
  const _userService = inject(UserService)

  const status = _userService.hasPermissions(route.data["permissions"]);

  if (status == false || !route.data["permissions"]) {
    _router.navigate(['/'])
  }

  return status
}

