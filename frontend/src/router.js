import {Main} from "./components/main.js";
import {Login} from "./components/login.js";
import {SignUp} from "./components/sign-up.js";
import {FileUtils} from "./utils/file-utils.js";
import {Logout} from "./components/logout.js";
import {Income} from "./components/income.js";
import {GeneratingIncome} from "./components/generating-income.js";
import {EditingIncome} from "./components/editing-income.js";
import {Expenses} from "./components/expenses.js";
import {GeneratingExpenses} from "./components/generating-expenses.js";
import {EditingExpenses} from "./components/editing-expenses.js";
import {IncomeExpenses} from "./components/income&expenses.js";
import {CreateIncomeExpenses} from "./components/create-income&expenses.js";
import {EditingIncomeExpenses} from "./components/editing-income&expenses.js";
import {LayoutSidebar} from "./components/layout.js";
import {SidebarUI} from "./utils/sidebar-ui.js";

export class Router {

    constructor() {

        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.bootstrapStyleElement = document.getElementById('bootstrap_style');

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

    inetEvens() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async openNewRoute(url) {
        const currentRoute = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);
    }

    async clickHandler(e) {
        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.closest('a')) {
            element = e.target.closest('a');
        }

        if (element) {
            e.preventDefault();

            const currentRoute = window.location.pathname;
            const url = element.href.replace(window.location.origin, '');

            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
                return;
            }
            await this.openNewRoute(url);
        }
    }

    async fadeInContent(block, html) {
        block.classList.add('fade');
        block.style.opacity = 0;
        await new Promise(resolve => setTimeout(resolve, 100));
        block.innerHTML = html;
        block.style.opacity = 1;
        block.classList.remove('fade');
    }

    async activateRoute(e, oldRoute = null) {
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
            if (typeof currentRoute?.unload === 'function') {
                currentRoute.unload();
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

            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | Finance';
            }
            if (newRoute.filePathTemplate) {
                document.body.className = '';
                let contentBlock = this.contentPageElement;

                if (newRoute.useLayout) {
                    const layoutHTML = await fetch(newRoute.useLayout).then(res => res.text());
                    this.contentPageElement.innerHTML = layoutHTML;
                    contentBlock = document.getElementById('content-layout');
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
