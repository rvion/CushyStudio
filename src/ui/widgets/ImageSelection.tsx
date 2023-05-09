import React, { useState } from 'react'
import { Button, Modal } from 'rsuite'
import styles from './ImageSelection.module.css'

type ImageSelectionProps = {
    urls: string[]
    get: () => boolean
    set: (value: string) => void
}

const ImageSelection = (props: ImageSelectionProps) => {
    const { urls, get, set } = props
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    const [selectedUrl, setSelectedUrl] = useState<string | null>(null)
    const [modalIndex, setModalIndex] = useState<number>(0)
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)

    const handleClick = (url: string, index: number) => {
        setSelectedIndex(index)
        set(url)
    }

    const handleSelect = (url: string) => {
        setSelectedUrl(url)
        setModalIsOpen(false)
        set(url)
    }

    const openModal = () => {
        setModalIndex(selectedIndex !== null ? selectedIndex : 0)
        setModalIsOpen(true)
    }

    const closeModal = () => {
        setModalIsOpen(false)
    }

    const handleSetImage = () => {
        setSelectedIndex(modalIndex)
        set(urls[modalIndex])
        closeModal()
    }

    const handleNextImage = () => {
        setModalIndex((prevState) => (prevState + 1) % urls.length)
    }

    const handlePrevImage = () => {
        setModalIndex((prevState) => (prevState - 1 + urls.length) % urls.length)
    }

    return (
        <div>
            <div className={styles.imageGridContainer}>
                <div className={styles.grid}>
                    {urls.map((url, index) => (
                        <div
                            key={url}
                            className={styles.gridItem}
                            onClick={() => handleClick(url, index)}
                            onMouseOver={(e) => {
                                const target = e.currentTarget
                                const hoverEffect = document.createElement('div')
                                hoverEffect.className = `${styles.hoverEffect} hover-effect`
                                target.appendChild(hoverEffect)
                            }}
                            onMouseOut={(e) => {
                                const target = e.currentTarget
                                const hoverEffect = target.querySelector('.hover-effect')
                                if (hoverEffect) {
                                    target.removeChild(hoverEffect)
                                }
                            }}
                        >
                            <img src={url} alt='' className={styles.image} />
                            {selectedIndex === index && <div className={styles.selectedBorder} />}
                        </div>
                    ))}
                </div>
            </div>
            <Button onClick={openModal}>Open Image Modal</Button>

            {modalIsOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <button className={`${styles.button} ${styles.buttonClose}`} onClick={closeModal}>
                            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#333333' width='36px' height='36px'>
                                <path d='M0 0h24v24H0z' fill='none' />
                                <path d='M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z' />
                            </svg>
                        </button>
                        <button className={`${styles.button} ${styles.buttonPrev}`} onClick={handlePrevImage}>
                            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#333333' width='36px' height='36px'>
                                <path d='M0 0h24v24H0z' fill='none' />
                                <path d='M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z' />
                            </svg>
                        </button>
                        <img src={urls[modalIndex]} alt='' className={styles.modalImage} />
                        <button className={`${styles.button} ${styles.buttonNext}`} onClick={handleNextImage}>
                            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#333333' width='36px' height='36px'>
                                <path d='M0 0h24v24H0z' fill='none' />
                                <path d='M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z' />
                            </svg>
                        </button>
                        <button className={`${styles.button} ${styles.buttonSelect}`} onClick={handleSetImage}>
                            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' width='36px' height='36px'>
                                <circle cx='12' cy='12' r='10' stroke='#333333' strokeWidth='2' fill='none' />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ImageSelection
