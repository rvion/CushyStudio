import clsx from 'clsx'
import Heading from '@theme/Heading'
import styles from './styles.module.css'

type FeatureItem = {
    title: string
    Svg: React.ComponentType<React.ComponentProps<'svg'>>
    description: JSX.Element
}

const FeatureList: FeatureItem[] = [
    {
        title: '🖥️ Cushy Studio',
        Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
        description: (
            <>
                **Cushy Studio**: A modern and cross-platform software to **Play** and **Work** with Generative AI Art. Explore
                and build generative Apps. **🌠 Image**, **🎥 Video**, and **🧊 3d**. Welcome to the future.
            </>
        ),
    },
    {
        title: '💎 Cushy Apps',
        Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
        description: (
            <>
                **Cushy Apps**: Self-contained, use-case-centric applications with dedicated UIs that make generative art simple
                for everyone. Find the app for you need in the **Cushy Library**, from general-purpose Apps to very specific ones
                for dedicated use cases.
            </>
        ),
    },
    {
        title: '🚀 Cushy SDK',
        Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
        description: (
            <>
                **Cushy SDK**: Automate your work or tackle specific use cases by building your own **App**. CushyStudio is packed
                with power-user tools to support you in building the "app" of your dreams. Once ready, share it with the world
                through the cushy app library.
            </>
        ),
    },
    {
        title: 'Cushy Cloud',
        Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
        description: (
            <>
                ☀️ **Cushy Cloud**: A cloud GPU renting service is launching soon so you can play with any demanding app, even on
                mobile devices. Fair prices to fund the CushyStudio growth, and grow the community. Growing the community includes
                revenue sharing with app creators when users rent GPU to use their app.
            </>
        ),
    },
]

function Feature({ title, Svg, description }: FeatureItem) {
    return (
        <div className={clsx('col col--4')}>
            <div className='text--center'>
                <Svg className={styles.featureSvg} role='img' />
            </div>
            <div className='text--center padding-horiz--md'>
                <Heading as='h3'>{title}</Heading>
                <p>{description}</p>
            </div>
        </div>
    )
}

export default function HomepageFeatures(): JSX.Element {
    return (
        <section className={styles.features}>
            <div className='container'>
                <div className='row'>
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    )
}
