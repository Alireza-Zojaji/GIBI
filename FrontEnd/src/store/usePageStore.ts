import { create } from 'zustand';
import { HiTrendingUp, HiUser } from 'react-icons/hi';
import { GiMoneyStack } from 'react-icons/gi';
import AdminPageView from '../views/admin';
import React from 'react';
import { IconType } from 'react-icons/lib';
import InvestPageView from '../views/invest';
import GainPageView from '../views/gain';

export interface Page {
	admin?: boolean;
	login?: boolean;
	route: string;
	title: string;
	key: string;
	component: React.ComponentType;
	Icon: IconType;
}

interface PageStore {
	pages: Page[];
}

export const usePageStore = create<PageStore>(() => ({
	pages: [
		{
			route: '/',
			title: 'Invest',
			key: 'invest',
			component: InvestPageView,
			Icon: GiMoneyStack,
		},
		{
			route: '/gain',
			title: 'Gain',
			key: 'gain',
			component: GainPageView,
			Icon: HiTrendingUp,
			login: true,
		},
		{
			route: '/admin',
			title: 'Admin',
			key: 'admin',
			component: AdminPageView,
			Icon: HiUser,
			admin: true,
		},
	],
}));
