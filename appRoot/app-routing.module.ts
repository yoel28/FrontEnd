import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {DashboardComponent} from "./com.zippyttech.init/dashboard/dashboard.component";
import {LoginComponent} from "./com.zippyttech.auth/login/login.component";
import {RecoverComponent} from "./com.zippyttech.auth/recover/recover.component";
import {RecoverPasswordComponent} from "./com.zippyttech.auth/recoverPassword/recoverpassword.component";
import {AclComponent} from "./com.zippyttech.access/acl/acl.component";
import {ProfileComponent} from "./com.zippyttech.access/user/profile/profile.component";
import {ImageEditComponent} from "./com.zippyttech.ui/components/imageEdit/imageEdit.component";
import {LoadComponent} from "./com.zippyttech.init/load/load.component";
import {PermissionComponent} from "./com.zippyttech.access/permission/permission.component";
import {BaseViewComponent} from "./com.zippyttech.ui/view/base/baseView.component";
import {TooltipComponent} from "./com.zippyttech.ui/components/tooltips/tooltips.component";
import {TablesComponent} from "./com.zippyttech.ui/components/tables/tables.component";
import {SearchComponent} from "./com.zippyttech.ui/components/search/search.component";
import {FilterComponent} from "./com.zippyttech.ui/components/filter/filter.component";
import {SaveComponent} from "./com.zippyttech.ui/components/save/save.component";
import {RoleComponent} from "./com.zippyttech.access/role/role.component";
import {EventComponent} from "./com.zippyttech.business/event/event.component";
import {InfoComponent} from "./com.zippyttech.business/info/info.component";
import {RuleComponent} from "./com.zippyttech.business/rule/rule.component";
import {ParamComponent} from "./com.zippyttech.business/param/param.component";
import {AccountComponent} from "./com.zippyttech.access/account/account.component";
import {UserComponent} from "./com.zippyttech.access/user/user.component";
import {SearchMultipleComponent} from "./com.zippyttech.ui/components/searchMultiple/searchMultiple.component";
import {ToastyModule} from "ng2-toasty";
import {FormComponent} from "./com.zippyttech.ui/components/form/form.component";
import {NotificationComponent} from "./com.zippyttech.business/notification/notification.component";
import {ModalComponent} from "./com.zippyttech.ui/components/modal/modal.component";
import {TermConditionsComponent} from "./com.zippyttech.business/termConditions/termConditions.component";
import {RuleViewComponent} from "./com.zippyttech.ui/components/ruleView/ruleView.component";
import {ChannelComponent} from "./com.zippyttech.business/channel/channel.component";

const routesDefault: Routes = [

    { path: '', redirectTo: 'init/dashboard', pathMatch: 'full'},
    { path: 'init/dashboard', component: DashboardComponent},
    { path: 'init/load', component: LoadComponent},
    { path: 'term/conditions', component: TermConditionsComponent},

    { path: 'auth/login', component: LoginComponent},
    { path: 'auth/login/:company', component: LoginComponent},
    { path: 'auth/recover', component: RecoverComponent},
    { path: 'account/recoverPassword/:id/:token', component: RecoverPasswordComponent},

    { path: 'access/account', component: AccountComponent},
    { path: 'access/role', component: RoleComponent},
    { path: 'access/permission', component: PermissionComponent},
    { path: 'access/acl', component: AclComponent},
    { path: 'access/user', component: UserComponent},
    { path: 'access/user/profile', component: ProfileComponent},


    { path: 'business/event', component: EventComponent},
    { path: 'business/info', component: InfoComponent},
    { path: 'business/rule', component: RuleComponent},
    { path: 'business/param', component: ParamComponent},
    { path: 'business/channel', component: ChannelComponent},
];
const routesApp: Routes = [];
@NgModule({
    imports: [
        RouterModule.forRoot(routesDefault.concat(routesApp)),
        ToastyModule.forRoot()
    ],
    exports: [RouterModule,ToastyModule]
})
export class AppRoutingModule {
}

export const componentsDefault = [
    DashboardComponent,
    LoginComponent,
    RecoverComponent,
    RecoverPasswordComponent,
    AclComponent,
    ProfileComponent,
    LoadComponent,
    PermissionComponent,
    RoleComponent,
    EventComponent,
    InfoComponent,
    RuleComponent,
    ParamComponent,
    AccountComponent,
    UserComponent,
    NotificationComponent,
    TermConditionsComponent,
    ChannelComponent
];
export const componentsView = [
    ImageEditComponent,
    BaseViewComponent,
    TooltipComponent,
    TablesComponent,
    SearchComponent,
    FilterComponent,
    SaveComponent,
    SearchMultipleComponent,
    FormComponent,
    ModalComponent,
    RuleViewComponent
];
export const componentsApp = [];
export const componentsPublic = [
    'LoginComponent',
    'ActivateComponent',
    'RecoverComponent',
    'RecoverPasswordComponent',
    'TermConditionsComponent'
];