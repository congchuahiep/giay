export interface paths {
    "/api/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Login */
        post: operations["login"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Logout */
        post: operations["logout"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/refresh-token": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Refresh Token */
        post: operations["refresh_token"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Register a new user */
        post: operations["register"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/revoke-token/{session_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Revoke Token */
        post: operations["revoke_token"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/user/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["me"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/workspace": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List all workspaces the user is a member of */
        get: operations["list_workspaces"];
        put?: never;
        /** Create a new workspace */
        post: operations["create_workspace"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/workspace/invitations/{token}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Preview invitation */
        get: operations["preview_invitation"];
        put?: never;
        /** Accept invitation */
        post: operations["accept_invitation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/workspace/{workspace_slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a workspace detail by slug */
        get: operations["get_workspace"];
        put?: never;
        post?: never;
        /** Delete workspace */
        delete: operations["delete_workspace"];
        options?: never;
        head?: never;
        /** Update workspace */
        patch: operations["update_workspace"];
        trace?: never;
    };
    "/api/workspace/{workspace_slug}/current": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get current workspace */
        get: operations["current_workspace"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/workspace/{workspace_slug}/invitations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List workspace invitations */
        get: operations["list_invitations"];
        put?: never;
        /** Send invitation */
        post: operations["send_invitation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/workspace/{workspace_slug}/invitations/{invitation_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Revoke invitation */
        delete: operations["revoke_invitation"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/workspace/{workspace_slug}/invitations/{invitation_id}/resend": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Resend invitation */
        post: operations["resend_invitation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/workspace/{workspace_slug}/members": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List workspace members */
        get: operations["list_members"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/workspace/{workspace_slug}/members/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Leave the workspace */
        delete: operations["leave_workspace"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/workspace/{workspace_slug}/members/{user_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Remove a member from the workspace */
        delete: operations["remove_member"];
        options?: never;
        head?: never;
        /** Update member role */
        patch: operations["update_member_role"];
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        ActiveWorkspaceResponse: {
            /** @example owner */
            userRole: string;
            workspace: components["schemas"]["WorkspaceResponse"];
        };
        CreateInvitationRequest: {
            /** @example colleague@example.com */
            email: string;
            /** @example member */
            role: string;
        };
        CreateWorkspaceRequest: {
            /** @example 🚀 */
            icon?: string | null;
            /** Format: uuid */
            id?: string | null;
            /** @example My Team Workspace */
            name: string;
            /** @example my-workspace */
            slug: string;
        };
        InvitationPreviewResponse: {
            email: string;
            /** @example member */
            role: string;
            userExists: boolean;
            /** @example 🚀 */
            workspaceIcon?: string | null;
            /** @example My Workspace */
            workspaceName: string;
            /** @example my-workspace */
            workspaceSlug: string;
        };
        InvitationResponse: {
            acceptedAt?: string | null;
            createdAt?: string | null;
            email: string;
            expiresAt: string;
            /** Format: uuid */
            id: string;
            revokedAt?: string | null;
            role: string;
            /** Format: uuid */
            token: string;
            /** Format: uuid */
            workspaceId: string;
        };
        LoginRequest: {
            /** @example admin@workspace.com */
            email: string;
            /** @example Secret123! */
            password: string;
        };
        MemberResponse: {
            email: string;
            firstName: string;
            /** Format: uuid */
            id: string;
            joinedAt: string;
            lastName: string;
            /** @example member */
            role: string;
        };
        RefreshRequest: {
            refreshToken: string;
        };
        RegisterRequest: {
            /** @example admin@workspace.com */
            email: string;
            /** @example Steve */
            firstName: string;
            /** @example Job */
            lastName: string;
            /** @example Secret123! */
            password: string;
        };
        TokenResponse: {
            accessToken: string;
            refreshToken: string;
            /** @example Bearer */
            tokenType: string;
        };
        UpdateMemberRoleRequest: {
            /** @example moderator */
            role: string;
        };
        UpdateWorkspaceRequest: {
            /** @example 🚀 */
            icon?: string | null;
            /** @example My Team Workspace */
            name?: string | null;
            /** @example my-workspace */
            slug?: string | null;
        };
        UserResponse: {
            /** @example admin@workspace.com */
            email: string;
            /** @example Steve */
            firstName: string;
            /** Format: uuid */
            id: string;
            /** @example true */
            isActive: boolean;
            /** @example Job */
            lastName: string;
            role: components["schemas"]["UserRole"];
        };
        /** @enum {string} */
        UserRole: "admin" | "user";
        WorkspaceResponse: {
            createdAt?: string | null;
            /** @example 🚀 */
            icon?: string | null;
            /** Format: uuid */
            id: string;
            /** @example My Workspace */
            name: string;
            /** Format: uuid */
            ownerId?: string | null;
            /** @example my-workspace */
            slug: string;
            updatedAt?: string | null;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    login: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginRequest"];
            };
        };
        responses: {
            /** @description Đăng nhập thành công */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TokenResponse"];
                };
            };
            /** @description Sai email hoặc mật khẩu */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    logout: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RefreshRequest"];
            };
        };
        responses: {
            /** @description Logout successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    refresh_token: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RefreshRequest"];
            };
        };
        responses: {
            /** @description Refresh token successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TokenResponse"];
                };
            };
            /** @description Refresh token is invalid or has been revoked */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    register: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RegisterRequest"];
            };
        };
        responses: {
            /** @description Registration successful */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TokenResponse"];
                };
            };
            /** @description Invalid data or email already exists */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    revoke_token: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The ID of the session to revoke */
                session_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Revoke token successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Session not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    me: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Lấy thông tin người dùng thành công */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserResponse"];
                };
            };
            /** @description Không tìm thấy người dùng */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Lỗi server nội bộ */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    list_workspaces: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of workspaces */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkspaceResponse"];
                };
            };
        };
    };
    create_workspace: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateWorkspaceRequest"];
            };
        };
        responses: {
            /** @description Workspace created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkspaceResponse"];
                };
            };
        };
    };
    preview_invitation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The invitation token
                 * @example 00000000-0000-0000-0000-000000000000
                 */
                token: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Invitation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InvitationPreviewResponse"];
                };
            };
            /** @description Invalid token or invitation already accepted */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Invitation not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    accept_invitation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The invitation token
                 * @example 00000000-0000-0000-0000-000000000000
                 */
                token: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Invitation accepted */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InvitationResponse"];
                };
            };
            /** @description Invalid token or invitation already accepted */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Invitation not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    get_workspace: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The slug of the workspace
                 * @example my-workspace
                 */
                workspace_slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Workspace found */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkspaceResponse"];
                };
            };
        };
    };
    delete_workspace: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The slug of the workspace
                 * @example my-workspace
                 */
                workspace_slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Workspace deleted */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    update_workspace: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The slug of the workspace
                 * @example my-workspace
                 */
                workspace_slug: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateWorkspaceRequest"];
            };
        };
        responses: {
            /** @description Workspace updated */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    current_workspace: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The slug of the workspace
                 * @example my-workspace
                 */
                workspace_slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Current workspace */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActiveWorkspaceResponse"];
                };
            };
        };
    };
    list_invitations: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The slug of the workspace */
                workspace_slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of invitations */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InvitationResponse"][];
                };
            };
        };
    };
    send_invitation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The slug of the workspace
                 * @example my-workspace
                 */
                workspace_slug: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateInvitationRequest"];
            };
        };
        responses: {
            /** @description Invitation sent */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InvitationResponse"];
                };
            };
        };
    };
    revoke_invitation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The slug of the workspace */
                workspace_slug: string;
                /** @description The ID of the invitation to revoke */
                invitation_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Invitation successfully revoked */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Cannot revoke accepted invitation */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    resend_invitation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The slug of the workspace
                 * @example my-workspace
                 */
                workspace_slug: string;
                /**
                 * @description The ID of the invitation
                 * @example
                 */
                invitation_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Invitation resent */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InvitationResponse"];
                };
            };
            /** @description Invitation already accepted or email already a member */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Invitation not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    list_members: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The slug of the workspace */
                workspace_slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of members */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MemberResponse"][];
                };
            };
        };
    };
    leave_workspace: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The slug of the workspace */
                workspace_slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Left the workspace successfully */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    remove_member: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The slug of the workspace */
                workspace_slug: string;
                /** @description The ID of the user to remove */
                user_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Member removed successfully */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    update_member_role: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The slug of the workspace */
                workspace_slug: string;
                /** @description The ID of the user */
                user_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateMemberRoleRequest"];
            };
        };
        responses: {
            /** @description Role updated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}
