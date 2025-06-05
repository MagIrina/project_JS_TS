import {Main} from "./components/main";
import {Login} from "./components/login";
import {SignUp} from "./components/sign-up";
import {FileUtils} from "./utils/file-utils";
import {Logout} from "./components/logout";
import {Income} from "./components/income";
import {GeneratingIncome} from "./components/generating-income";
import {EditingIncome} from "./components/editing-income";
import {Expenses} from "./components/expenses";
import {GeneratingExpenses} from "./components/generating-expenses";
import {EditingExpenses} from "./components/editing-expenses";
import {IncomeExpenses} from "./components/income&expenses";
import {CreateIncomeExpenses} from "./components/create-income&expenses";
import {EditingIncomeExpenses} from "./components/editing-income&expenses";
import {LayoutSidebar} from "./components/layout";
import {SidebarUI} from "./utils/sidebar-ui";
import {RouteType} from "./types/route.type";

export class Router {

    readonly titlePageElement: HTMLElement | null;
    readonly contentPageElement: HTMLElement | null;
    readonly bootstrapStyleElement: HTMLElement | null;

    private routes: RouteType[];

    constructor() {

        this.titlePageElement = document.getElementById('title')!;
        this.contentPageElement = document.getElementById('content')!;
        this.bootstrapStyleElement = document.getElementById('bootstrap_style')!;

        this.inetEvens();

        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/main.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    document.body.classList.remove('d-flex');
                    SidebarUI.activateMain();
                    new Main(this.openNewRoute.bind(this));
                    new LayoutSidebar(this.openNewRoute.bind(this));
                },
                unLoad: () => {
                    document.body.classList.add('d-flex');
                },
                styles: ['Chart.min.css'],
                scripts: ['Chart.min.js',
                    'Chart.bundle.min.js']
            },
            {
                route: '/income',
                title: 'Доходы',
                filePathTemplate: '/templates/income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    SidebarUI.resetCategories();
                    SidebarUI.activateIncome();
                    new Income(this.openNewRoute.bind(this));
                    new LayoutSidebar(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/generating-income',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/generating-income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    SidebarUI.resetCategories();
                    SidebarUI.activateIncome();
                    new GeneratingIncome(this.openNewRoute.bind(this));
                    new LayoutSidebar(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/editing-income',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/editing-income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    SidebarUI.resetCategories();
                    SidebarUI.activateIncome();
                    new EditingIncome(this.openNewRoute.bind(this));
                    new LayoutSidebar(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expenses',
                title: 'Расходы',
                filePathTemplate: '/templates/expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    SidebarUI.resetCategories();
                    SidebarUI.activateExpenses();
                    new Expenses(this.openNewRoute.bind(this));
                    new LayoutSidebar(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/generating-expenses',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/generating-expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    SidebarUI.resetCategories();
                    SidebarUI.activateExpenses();
                    new GeneratingExpenses(this.openNewRoute.bind(this));
                    new LayoutSidebar(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/editing-expenses',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/editing-expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    SidebarUI.resetCategories();
                    SidebarUI.activateExpenses();
                    new EditingExpenses(this.openNewRoute.bind(this));
                    new LayoutSidebar(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income&expenses',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/income&expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    SidebarUI.resetCategories();
                    SidebarUI.activateIncomeExpenses();
                    new IncomeExpenses(this.openNewRoute.bind(this));
                    new LayoutSidebar(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/create-income&expenses',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/create-income&expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    SidebarUI.resetCategories();
                    SidebarUI.activateIncomeExpenses();
                    new CreateIncomeExpenses(this.openNewRoute.bind(this));
                    new LayoutSidebar(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/editing-income&expenses',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/editing-income&expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    SidebarUI.resetCategories();
                    SidebarUI.activateIncomeExpenses();
                    new EditingIncomeExpenses(this.openNewRoute.bind(this));
                    new LayoutSidebar(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/404.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'bg-white');
                },
                unLoad: () => {
                    document.body.classList.remove('d-flex', 'justify-content-center', 'align-items-center', 'bg-white');
                },
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/login.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'bg-white');
                    new Login(this.openNewRoute.bind(this));
                },
                unLoad: () => {
                    document.body.classList.remove('d-flex', 'justify-content-center', 'align-items-center', 'bg-white');
                },
                styles: [
                    'icheck-bootstrap.min.css'
                ]
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/sign-up.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'bg-white');
                    new SignUp(this.openNewRoute.bind(this));
                },
                unLoad: () => {
                    document.body.classList.remove('d-flex', 'justify-content-center', 'align-items-center', 'bg-white');
                },
                styles: [
                    'icheck-bootstrap.min.css'
                ]
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                }
            },
        ]
    }

    private inetEvens(): void {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    private async openNewRoute(url: string): Promise<void> {
        const currentRoute = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);
    }

    private async clickHandler(e: MouseEvent): Promise<void> {
        let element: HTMLElement | null = null; // Инициализация по умолчанию
        const target = e.target as HTMLElement;

        if (target.nodeName === 'A') {
            element = target;
        } else {
            element = target.closest('a');
        }

        if (element && element instanceof HTMLAnchorElement) {
            e.preventDefault();

            const currentRoute = window.location.pathname;
            const url = element.href.replace(window.location.origin, '');

            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
                return;
            }
            await this.openNewRoute(url);
        }
    }

    private async fadeInContent(block: HTMLElement, html: string): Promise<void> {
        block.classList.add('fade');
        block.style.opacity = '0';
        await new Promise(resolve => setTimeout(resolve, 100));
        block.innerHTML = html;
        block.style.opacity = '1';
        block.classList.remove('fade');
    }

    private async activateRoute(_e: Event | null = null, oldRoute: string | null = null): Promise<void> {
        if (oldRoute) {
            const currentRoute = this.routes.find(item => item.route === oldRoute);
            if (currentRoute?.styles) {
                currentRoute.styles.forEach(style => {
                    document.querySelector(`link[href = '/css/${style}']`)?.remove();
                });
            }
            if (currentRoute?.scripts) {
                currentRoute.scripts.forEach(script => {
                    document.querySelector(`script[src = '/js/${script}']`)?.remove();
                });
            }
            if (typeof currentRoute?.unLoad === 'function') {
                currentRoute.unLoad();
            }
        }

        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if (newRoute.styles) {
                newRoute.styles.forEach(style => {
                    FileUtils.loadPageStyle('/css/' + style, this.bootstrapStyleElement);
                });
            }

            if (newRoute.scripts) {
                for (const script of newRoute.scripts) {
                    await FileUtils.loadPageScript('/js/' + script);
                }
            }

            if (newRoute.title && this.titlePageElement) {
                this.titlePageElement.innerText = newRoute.title + ' | Finance';
            }
            if (newRoute.filePathTemplate && this.contentPageElement) {
                document.body.className = '';
                let contentBlock = this.contentPageElement;

                if (newRoute.useLayout) {
                    const layoutHTML = await fetch(newRoute.useLayout).then(res => res.text());
                    this.contentPageElement.innerHTML = layoutHTML;
                    contentBlock = document.getElementById('content-layout')! as HTMLElement;
                    document.body.classList.add('custom-layout');
                }

                const contentHTML = await fetch(newRoute.filePathTemplate).then(res => res.text());
                await this.fadeInContent(contentBlock, contentHTML);
            }

            if (typeof newRoute.load === 'function') {
                newRoute.load();
            }

            if (!['/login', '/sign-up'].includes(urlRoute)) {
                new LayoutSidebar(this.openNewRoute.bind(this));
            }
        } else {
            console.warn('No route found, redirecting to /404');
            history.pushState({}, '', '/404');
            await this.activateRoute();
        }
    }
}
