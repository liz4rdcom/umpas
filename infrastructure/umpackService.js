const rp = require('request-promise');

class UmpackService {
  constructor(project) {
    this.project = project;
  }

  login() {
    const options = {
      method: 'POST',
      uri: this.project.umFullUrl + '/login',
      body: {
        userName: this.project.username,
        password: this.project.password
      },
      json: true
    };

    return rp(options)
      .then(function(token) {
        this.token = token;
      }.bind(this));
  }

  activateUser(userId) {
    const activated = true;
    const options = this._statusUpdateOptions(userId, activated);

    return rp(options);
  }

  deactivateUser(userId) {
    const isActivated = false;

    const options = this._statusUpdateOptions(userId, isActivated);

    return rp(options);
  }

  getAllUsers() {
    const options = {
      method: 'GET',
      uri: this.project.umFullUrl + '/users',
      headers: this._getHeaders(),
      json: true
    };

    return rp(options);
  }

  getUserById(id) {
    const options = {
      uri: this.project.umFullUrl + '/users/' + id,
      headers: this._getHeaders(),
      json: true
    };

    return rp(options);
  }

  deleteUser(id) {
    const options = {
      method: 'DELETE',
      uri: this.project.umBaseUrl + '/users/' + id,
      headers: this._getHeaders(),
      json: true
    };

    return rp(options);
  }

  changeUserInfo(id, info) {
    const options = {
      method: 'PUT',
      uri: this.project.umBaseUrl + '/users/' + id,
      body: info,
      headers: this._getHeaders(),
      json: true
    };

    return rp(options);
  }

  assignUserRole(userId, role) {
    const options = this._userRoleUpdateOptions(userId, role, true);

    return rp(options);
  }

  removeUserRole(userId, role) {
    const options = this._userRoleUpdateOptions(userId, role, false);

    return rp(options);
  }

  _userRoleUpdateOptions(userId, role, enable) {
    const options = {
      method: 'POST',
      uri: this.project.umFullUrl + '/updateUserRoles',
      headers: this._getHeaders(),
      body: {
        id: userId,
        roleName: role,
        enable: enable
      },
      json: true
    };

    return options;
  }

  _statusUpdateOptions(userId, isActivated) {
    const options = {
      method: 'POST',
      uri: this.project.umFullUrl + '/updateUserStatus',
      headers: this._getHeaders(),
      body: {
        id: userId,
        isActivated: isActivated
      },
      json: true
    };

    return options;
  }

  _getHeaders() {
    return {
      authorization: this.token
    };
  }

}
