import React, { Component } from 'react'

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import type { ImageID } from 'src/models/Image'

import { observer } from 'mobx-react-lite'
import { useSt } from 'src/front/FrontStateCtx'

export const LastImageUI = observer(function LastImageUI_(p: { imageID?: ImageID }) {
    const st = useSt()
    const imgs = p.imageID //
        ? st.db.images.get(p.imageID)
        : st.db.images.last()
    if (imgs == null) return null
    return (
        <div tw='w-full h-full'>
            <TransformWrapper>
                <TransformComponent>
                    {/* <img src="image.jpg" alt="test" /> */}
                    <img
                        style={{
                            maxHeight: '100%',
                            maxWidth: '100%',
                            objectFit: 'contain',
                        }}
                        src={imgs.url}
                        alt='last generated image'
                    />
                </TransformComponent>
            </TransformWrapper>
        </div>
    )
})
