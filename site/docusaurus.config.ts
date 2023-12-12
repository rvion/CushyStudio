import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

const config: Config = {
    title: 'CushyStudio',
    tagline: '🛋 The AI and Generative Art platform for everyone',
    favicon: 'img/favicon.ico',

    // Set the production url of your site here
    url: 'https://www.cushystudio.com/',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'rvion', // Usually your GitHub org/user name.
    projectName: 'CushyStudio', // Usually your repo name.

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    presets: [
        [
            'classic',
            {
                docs: {
                    sidebarPath: './sidebars.ts',
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
                },
                blog: {
                    showReadingTime: true,
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
                },
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        // Replace with your project's social card
        image: 'img/docusaurus-social-card.jpg',
        // https://docusaurus.io/docs/api/themes/configuration#respectPrefersColorScheme
        colorMode: {
            defaultMode: 'dark',
            respectPrefersColorScheme: true,
        },
        navbar: {
            title: 'CushyStudio',
            logo: {
                alt: 'My Site Logo',
                src: 'img/CushyLogo.png',
            },
            items: [
                {
                    type: 'docSidebar',
                    sidebarId: 'tutorialSidebar',
                    position: 'left',
                    label: 'Documentation',
                },
                { to: '/blog', label: 'Blog', position: 'left' },
                {
                    href: 'https://github.com/rvion/cushystudio',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Docs',
                    items: [
                        {
                            label: 'Documentation',
                            to: '/docs/intro',
                        },
                    ],
                },
                {
                    title: 'Community',
                    items: [
                        // {
                        //     label: 'Stack Overflow',
                        //     href: 'https://stackoverflow.com/questions/tagged/docusaurus',
                        // },
                        {
                            label: 'Discord',
                            href: 'https://discord.gg/GfAN6hF2ad',
                        },
                        {
                            label: 'Twitter',
                            href: 'https://twitter.com/_rvion',
                        },
                    ],
                },
                {
                    title: 'More',
                    items: [
                        {
                            label: 'Blog',
                            to: '/blog',
                        },
                        {
                            label: 'GitHub',
                            href: 'https://github.com/rvion/CushyStudio',
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} CushyStudio.`,
            //  Built with Docusaurus.
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
    } satisfies Preset.ThemeConfig,
}

export default config
