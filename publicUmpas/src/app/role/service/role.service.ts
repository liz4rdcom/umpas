import { Injectable } from '@angular/core';
import { RoleApiService } from './role-api.service';
import { ProjectService } from '../../project/service/project.service';

import { NotificationsService } from '../../core/notification/notifications.service';

@Injectable()
export class RoleService {
  roles: any = [];
  selectedRole: any;
  selectedRoleActions: any = [];
  timeOutMilliseconds = 4000;

  constructor(
    private api: RoleApiService,
    private notificationService: NotificationsService,
    private projectService: ProjectService
  ) { }

  fetchRoles() {
    return this.api.getRoles(this.projectService.selectedProjectId)
      .then((list) => this.roles = list)
      .catch(this.projectService.handleError.bind(this.projectService));
  }

  save(role, roleName): Promise<any> {

    let isEditMode = (item) => (item.actions != null);

    let pushRole = (item) => {
      this.roles.push(item);
    };

    let refreshRole = (roleItem, oldName) => {
      let roleIndex = this.roles.findIndex((item) => item.name === oldName);
      if (roleIndex === -1) { return; }
      Object.assign(this.roles[roleIndex], roleItem);
    };

    if (isEditMode(role)) {
      return this.api.putRole(this.projectService.selectedProjectId, role, roleName).then(refreshRole.bind(this, role, roleName))
        .then(this.notifySuccess.bind(this, 'role updated'))
        .catch(this.projectService.handleError.bind(this.projectService));
    }
    return this.api.postRole(this.projectService.selectedProjectId, role).then(pushRole)
      .then(this.notifySuccess.bind(this, 'role created successfully'))
      .catch(this.projectService.handleError.bind(this.projectService));

  }

  removeRole(role) {
    return this.api.deleteRole(this.projectService.selectedProjectId, role).then(() => {
      let index = this.roles.findIndex((item) => item.name === role.name);
      if (index === -1) { return; }
      this.roles.splice(index, 1);
      this.roles = this.roles.slice();
      this.selectedRole = null;
    })
      .then(this.notifySuccess.bind(this, 'role removed successfully'))
      .catch(this.projectService.handleError.bind(this.projectService));
  }

  notifySuccess(message) {
    this.notificationService.addNotification(
      message,
      'success',
      this.timeOutMilliseconds
    );
  }

}
