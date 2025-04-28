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

export class Router {

    constructor() {

        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.adminLteStyleElement = document.getElementById('adminlte_style');

        this.inetEvens();

        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/main.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    document.getElementById('main-active').classList.add('active');
                    new Main();
                },
                styles: [
                    'Chart.min.css'
                ],
                scripts: [
                    'Chart.min.js',
                ]
            },
            {
                route: '/income',
                title: 'Доходы',
                filePathTemplate: '/templates/income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    document.getElementById('categories-active').classList.add('active', 'menu-open');
                    document.querySelector('.has-treeview').classList.add('menu-open');
                    document.getElementById('income-active').classList.add('active');
                    new Income(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/generating-income',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/generating-income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    document.getElementById('categories-active').classList.add('active', 'menu-open');
                    document.querySelector('.has-treeview').classList.add('menu-open');
                    document.getElementById('income-active').classList.add('active');
                    new GeneratingIncome();
                },
            },
            {
                route: '/editing-income',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/editing-income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    document.getElementById('categories-active').classList.add('active', 'menu-open');
                    document.querySelector('.has-treeview').classList.add('menu-open');
                    document.getElementById('income-active').classList.add('active');
                    new EditingIncome();
                },
            },
            {
                route: '/expenses',
                title: 'Рфсходы',
                filePathTemplate: '/templates/expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    document.getElementById('categories-active').classList.add('active', 'menu-open');
                    document.querySelector('.has-treeview').classList.add('menu-open');
                    document.getElementById('expenses-active').classList.add('active');
                    new Expenses(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/generating-expenses',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/generating-expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    document.getElementById('categories-active').classList.add('active', 'menu-open');
                    document.querySelector('.has-treeview').classList.add('menu-open');
                    document.getElementById('expenses-active').classList.add('active');
                    new GeneratingExpenses();
                },
            },
            {
                route: '/editing-expenses',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/editing-expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    document.getElementById('categories-active').classList.add('active', 'menu-open');
                    document.querySelector('.has-treeview').classList.add('menu-open');
                    document.getElementById('expenses-active').classList.add('active');
                    new EditingExpenses();
                },
            },
            {
                route: '/income&expenses',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/income&expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    document.getElementById('income-expenses-active').classList.add('active');
                    new IncomeExpenses(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/create-income&expenses',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/create-income&expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    document.getElementById('categories-active').classList.add('active', 'menu-open');
                    document.querySelector('.has-treeview').classList.add('menu-open');
                    document.getElementById('income-active').classList.add('active');
                    new CreateIncomeExpenses();
                },
            },
            {
                route: '/editing-income&expenses',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/editing-income&expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    document.getElementById('categories-active').classList.add('active', 'menu-open');
                    document.querySelector('.has-treeview').classList.add('menu-open');
                    document.getElementById('income-active').classList.add('active');
                    new EditingIncomeExpenses();
                },
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/404.html',
                useLayout: false,
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/login.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('login-page', 'bg-white');
                    new Login(this.openNewRoute.bind(this));
                },
                unLoad: () => {
                    document.body.classList.remove('login-page', 'bg-white');
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
                    document.body.classList.add('login-page', 'bg-white');
                    new SignUp(this.openNewRoute.bind(this));
                },
                unLoad: () => {
                    document.body.classList.remove('login-page', 'bg-white');
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
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
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

    async activateRoute(e, oldRoute = null) {
        if (oldRoute) {
            const currentRoute = this.routes.find(item => item.route === oldRoute);
            if (currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => {
                    document.querySelector(`link[href = '/css/${style}']`).remove();
                });
            }
            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach(script => {
                    document.querySelector(`script[src = '/js/${script}']`).remove();
                });
            }
            if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                currentRoute.unload();
            }
        }

        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if (newRoute.styles && newRoute.styles.length > 0) {
                newRoute.styles.forEach(style => {
                    FileUtils.loadPageStyle('/css/' + style, this.adminLteStyleElement);
                });
            }

            if (newRoute.scripts && newRoute.scripts.length > 0) {
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
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');
                    document.body.classList.add('sidebar-mini');
                    document.body.classList.add('layout-fixed');
                } else {
                    document.body.classList.remove('sidebar-mini');
                    document.body.classList.remove('layout-fixed');
                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }

        } else {
            console.log('No route found');
            history.pushState({}, '', '/404');
            await this.activateRoute();
        }
    }
}