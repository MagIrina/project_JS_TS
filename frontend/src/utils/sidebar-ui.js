export const SidebarUI = {
    activateExpenses() {
        document.getElementById('categories-active')?.classList.add('active', 'text-white');
        document.getElementById('expenses-active')?.classList.add('active', 'text-white');
        document.getElementById('income-no-active')?.classList.add('text-no-active');

        const chevron = document.getElementById('categories-chevron-right');
        chevron?.classList.remove('bi-chevron-right');
        chevron?.classList.add('bi-chevron-down');

        document.getElementById('categories-active')?.setAttribute('aria-expanded', 'true');
        document.getElementById('home-collapse')?.classList.add('show');
    },

    activateIncome() {
        document.getElementById('categories-active')?.classList.add('active', 'text-white');
        document.getElementById('income-active')?.classList.add('active', 'text-white');

        const chevron = document.getElementById('categories-chevron-right');
        chevron?.classList.remove('bi-chevron-right');
        chevron?.classList.add('bi-chevron-down');

        document.getElementById('categories-active')?.setAttribute('aria-expanded', 'true');
        document.getElementById('home-collapse')?.classList.add('show');
    },

    resetCategories() {
        document.getElementById('categories-active')?.classList.remove('active', 'text-white');
        document.getElementById('income-active')?.classList.remove('active', 'text-white');
        document.getElementById('expenses-active')?.classList.remove('active', 'text-white');

        const chevron = document.getElementById('categories-chevron-right');
        chevron?.classList.remove('bi-chevron-down');
        chevron?.classList.add('bi-chevron-right');

        document.getElementById('categories-active')?.setAttribute('aria-expanded', 'false');
        document.getElementById('home-collapse')?.classList.remove('show');
    },

    activateMain() {
        document.getElementById('main-active')?.classList.add('active', 'text-white');
        document.getElementById('main-active-i')?.classList.add('text-white');
        document.getElementById('categories-border')?.classList.add('border-0');
    },

    activateIncomeExpenses() {
        document.getElementById('categories-border')?.classList.add('border-0');
        document.getElementById('income-expenses-active')?.classList.add('active', 'text-white');
        document.getElementById('income-expenses-active-i')?.classList.add('text-white');
    }
};