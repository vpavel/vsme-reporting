"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.Permission = void 0;
// Permission types
var Permission;
(function (Permission) {
    Permission["READ_USERS"] = "READ_USERS";
    Permission["WRITE_USERS"] = "WRITE_USERS";
    Permission["DELETE_USERS"] = "DELETE_USERS";
    Permission["EDIT_CONTENT"] = "EDIT_CONTENT";
    Permission["MANAGE_PERMISSIONS"] = "MANAGE_PERMISSIONS";
    Permission["ADMIN_ACCESS"] = "ADMIN_ACCESS";
})(Permission || (exports.Permission = Permission = {}));
var Role;
(function (Role) {
    Role["USER"] = "user";
    Role["EDITOR"] = "editor";
    Role["ADMIN"] = "admin";
})(Role || (exports.Role = Role = {}));
