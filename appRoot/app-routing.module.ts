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
import {BaseViewComponent} from "./com.zippyttech.ui/view/base/baseView.component";
import {TooltipComponent} from "./com.zippyttech.ui/components/tooltips/tooltips.component";
import {TablesComponent} from "./com.zippyttech.ui/components/tables/tables.component";
import {SearchComponent} from "./com.zippyttech.ui/components/search/search.component";
import {FilterComponent} from "./com.zippyttech.ui/components/filter/filter.component";
import {SaveComponent} from "./com.zippyttech.ui/components/save/save.component";
import {SearchMultipleComponent} from "./com.zippyttech.ui/components/searchMultiple/searchMultiple.component";
import {ToastyModule} from "ng2-toasty";
import {FormComponent} from "./com.zippyttech.ui/components/form/form.component";
import {ModalComponent} from "./com.zippyttech.ui/components/modal/modal.component";
import {TermConditionsComponent} from "./com.zippyttech.business/termConditions/termConditions.component";
import {RuleViewComponent} from "./com.zippyttech.ui/components/ruleView/ruleView.component";
import {AccountModel} from "./com.zippyttech.access/account/account.model";
import {PermissionModel} from "./com.zippyttech.access/permission/permission.model";
import {RoleModel} from "./com.zippyttech.access/role/role.model";
import {UserModel} from "./com.zippyttech.access/user/user.model";
import {ChannelModel} from "./com.zippyttech.business/channel/channel.model";
import {EventsModel} from "./com.zippyttech.business/event/events.model";
import {InfoModel} from "./com.zippyttech.business/info/info.model";
import {NotificationModel} from "./com.zippyttech.business/notification/notification.model";
import {ParamModel} from "./com.zippyttech.business/param/param.model";
import {RuleModel} from "./com.zippyttech.business/rule/rule.model";
import {ActivateComponent} from "./com.zippyttech.auth/activate/activate.component";
import {ChartViewComponent} from "./com.zippyttech.ui/components/chartview/chartview.component";
import {ListActionComponent} from "./com.zippyttech.ui/components/listAction/listAction.component";
import {LocationPickerComponent} from "./com.zippyttech.ui/components/locationPicker/locationPicker.component";
import {DataViewComponent} from "./com.zippyttech.ui/components/dataView/dataView.component";
import {BasicComponent} from "./com.zippyttech.common/basicComponent";
import {AccountSelectComponent} from "./com.zippyttech.auth/accountSelect/accountSelect.component";

const routesDefault: Routes = [

    { path: '', redirectTo: 'init/dashboard', pathMatch: 'full'},
    { path: 'init/dashboard', component: DashboardComponent},
    { path: 'init/load', component: LoadComponent},
    { path: 'term/conditions', component: TermConditionsComponent},

    { path: 'auth/login', component: LoginComponent},
    { path: 'auth/accountSelect', component: AccountSelectComponent},
    { path: 'auth/login/:company', component: LoginComponent},
    { path: 'auth/recover', component: RecoverComponent},
    { path: 'account/recoverPassword/:id/:token', component: RecoverPasswordComponent},
    { path: 'account/active/:id/:token', component: ActivateComponent},

    { path: 'access/account', component: BasicComponent,data:{'model':AccountModel}},
    { path: 'access/role', component: BasicComponent,data:{'model':RoleModel}},
    { path: 'access/permission', component: BasicComponent,data:{'model':PermissionModel}},
    { path: 'access/user', component: BasicComponent,data:{'model':UserModel}},
    { path: 'access/acl', component: AclComponent},
    { path: 'access/user/profile', component: ProfileComponent},


    { path: 'business/event', component: BasicComponent, data:{'model':EventsModel}},
    { path: 'business/info', component: BasicComponent,data:{'model':InfoModel}},
    { path: 'business/rule', component: BasicComponent, data:{'model':RuleModel}},
    { path: 'business/param', component: BasicComponent , data:{'model':ParamModel}},
    { path: 'business/channel', component: BasicComponent,data:{'model':ChannelModel}},
    { path: 'business/notify', component: BasicComponent,data:{'model':NotificationModel}},
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
    AccountSelectComponent,
    DashboardComponent,
    LoginComponent,
    RecoverComponent,
    RecoverPasswordComponent,
    AclComponent,
    ProfileComponent,
    ActivateComponent,
    LoadComponent,
    TermConditionsComponent,
    BasicComponent
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
    RuleViewComponent,
    ListActionComponent,
    ModalComponent,
    ChartViewComponent,
    LocationPickerComponent,
    ChartViewComponent,
    DataViewComponent
];
export const componentsApp = [];
export const componentsPublic = [
    'LoginComponent',
    'ActivateComponent',
    'RecoverComponent',
    'RecoverPasswordComponent',
    'TermConditionsComponent'
];

export const modelsDefault=[
    AccountModel,
    PermissionModel,
    RoleModel,
    UserModel,
    ChannelModel,
    EventsModel,
    InfoModel,
    NotificationModel,
    ParamModel,
    RuleModel
];
export const modelsApp=[];