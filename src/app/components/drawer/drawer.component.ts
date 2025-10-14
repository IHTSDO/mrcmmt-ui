import {Component, Input, OnInit} from '@angular/core';
import {DrawerService} from '../../services/drawer.service';
import {NgClass, CommonModule} from '@angular/common';
import {ConfigService} from '../../services/config.service';
import {User} from '../../models/user';

@Component({
    selector: 'app-drawer',
    imports: [CommonModule, NgClass],
    templateUrl: './drawer.component.html',
    styleUrl: './drawer.component.scss'
})
export class DrawerComponent implements OnInit {

    apps: any[] = [];

    @Input() user: User;

    constructor(private drawerService: DrawerService, private configService: ConfigService) {
    }

    ngOnInit() {
        const allApps = this.configService.getLauncherApps();
        this.apps = allApps.filter(a => !a.clientName || this.user.clientAccess.includes(a.clientName));
    }

    closeDrawer() {
        this.drawerService.setDrawerOpen(false);
        document.body.classList.remove('app-drawer-open');
    }

    appsByGroup(group: number): any[] {
        return this.apps.filter(a => (a.group ?? 4) === group);
    }

    redirectTo(url: string): void {
        window.open(url, '_blank');
    }
}
