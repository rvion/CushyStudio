import clsx from 'clsx'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import HomepageFeatures from '@site/src/components/HomepageFeatures'
import Heading from '@theme/Heading'

import styles from './index.module.css'

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext()
    return (
        // hero--primary
        <header className={clsx('hero', styles.heroBanner)}>
            <div className='container'>
                <Heading as='h1' className='hero__title'>
                    {siteConfig.title}
                </Heading>
                <p className='hero__subtitle'>{siteConfig.tagline}</p>
                <img src='/screenshots/2023-11-20-00-20-41.png' alt='' />
                <div className={styles.buttons}>
                    {/* <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Docusaurus Tutorial - 5min ⏱️
          </Link> */}
                </div>
            </div>
        </header>
    )
}

export default function Home(): JSX.Element {
    const { siteConfig } = useDocusaurusContext()
    return (
        <Layout title={`Hello from ${siteConfig.title}`} description='Description will go into a meta tag in <head />'>
            <HomepageHeader />
            <main>
                <HomepageFeatures />
            </main>
        </Layout>
    )
}
