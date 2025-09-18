import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, map, of} from 'rxjs';

export interface KeycloakConfig {
    baseUrl: string;
    clientId: string;
    login: {
        path: string;
        params: string;
    };
    logout: {
        path: string;
        params: string;
    };
}

export interface LauncherApp {
    Application: string;
    icon: string;
    faIcon: string;
    link: string;
    description: string;
    clientName: string;
    colour: string; // tailwind colour token e.g. sky-400
    textStyle: string; // CSS styles to apply to the text
    group: number;  // 1..4
    order: number;  // 1..n
}

export interface AppConfig {
    keycloak: KeycloakConfig;
    apps: LauncherApp[]
}

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private config: AppConfig | null = null;

    constructor(private http: HttpClient) {
    }

    loadConfig(): Observable<AppConfig> {
        // Try to load from assets first, fallback to hardcoded config
        return this.http.get<any>('/launcherConfig.json').pipe(
            map(data => {
                // Extract the config object from the JSON structure
                this.config = data; // The config is the first object in the array
                if (!this.config) {
                    throw new Error('Configuration not found in launcherConfig.json');
                }
                return this.config;
            }),
            map(config => {
                console.log('Configuration loaded from file:', config);
                return config;
            })
        ).pipe(
            map(config => config),
            map(config => {
                if (!config.keycloak) {
                    throw new Error('Keycloak configuration not found in configuration');
                }
                return config;
            })
        );
    }

    getLauncherApps(): LauncherApp[] {
        var apps = this.config?.apps || [];
        apps = apps.filter(a => !!a && !!a.link && !!a.Application)
            .sort((a, b) => (a.group ?? 99) - (b.group ?? 99) || (a.order ?? 99) - (b.order ?? 99) || a.Application.localeCompare(b.Application));
        return apps;
    }

    groupByGroup(apps: LauncherApp[]): Record<number, LauncherApp[]> {
        return apps.reduce((acc, app) => {
            const g = app.group ?? 4;
            (acc[g] ||= []).push(app);
            return acc;
        }, {} as Record<number, LauncherApp[]>);
    }

    getKeycloakAuthUrl(): string {
        if (!this.config?.keycloak) {
            return 'https://dev-snoauth.ihtsdotools.org/realms/snomed/protocol/openid-connect/auth?client_id=ims&response_type=code&scope=openid&redirect_uri=';
        }
        const {baseUrl, login} = this.config.keycloak;
        return `${baseUrl}${login.path}${login.params}`;
    }

    getKeycloakLogoutUrl(): string {
        if (!this.config?.keycloak) {
            return 'https://dev-snoauth.ihtsdotools.org/realms/snomed/protocol/openid-connect/logout?client_id=ims&post_logout_redirect_uri=';
        }
        const {baseUrl, logout} = this.config.keycloak;
        return `${baseUrl}${logout.path}${logout.params}`;
    }

    getLogoutUrlWithReturnTo(): string {
        const baseUrl = this.getKeycloakLogoutUrl();
        const returnTo = window.location.origin;
        const fullUrl = `${baseUrl}${encodeURIComponent(returnTo)}`;
        console.log('Generated Keycloak logout URL:', fullUrl);
        return fullUrl;
    }

    // Alternative method that doesn't require a specific client
    getKeycloakLoginUrl(): string {
        const currentUrl = window.location.origin;
        // Try realm-management client
        return `https://dev-snoauth.ihtsdotools.org/realms/snomed/protocol/openid-connect/auth?client_id=realm-management&response_type=code&scope=openid&redirect_uri=${encodeURIComponent(currentUrl)}`;
    }

    // Direct login without OAuth (fallback)
    getDirectKeycloakLoginUrl(): string {
        const currentUrl = window.location.origin;
        return `https://dev-snoauth.ihtsdotools.org/realms/snomed/login-actions/authenticate?session_code=xxx&execution=xxx&client_id=security-admin-console&tab_id=xxx`;
    }

    getAuthUrlWithReferrer(): string {
        const baseUrl = this.getKeycloakAuthUrl();
        const currentUrl = window.location.origin;
        const fullUrl = `${baseUrl}${encodeURIComponent(currentUrl)}`;
        console.log('Generated Keycloak URL:', fullUrl);
        console.log('Base URL:', baseUrl);
        console.log('Current URL:', currentUrl);
        console.log('Encoded current URL:', encodeURIComponent(currentUrl));
        console.log('Expected redirect URI pattern (nginx):', 'https://local.ihtsdotools.org:8092/*');
        console.log('Actual redirect URI being sent:', currentUrl);
        return fullUrl;
    }

    // New helper methods for the new structure
    getKeycloakBaseUrl(): string {
        return this.config?.keycloak?.baseUrl || 'https://dev-snoauth.ihtsdotools.org/realms/snomed/protocol/openid-connect';
    }

    getKeycloakClientId(): string {
        return this.config?.keycloak?.clientId || 'ims';
    }
}
