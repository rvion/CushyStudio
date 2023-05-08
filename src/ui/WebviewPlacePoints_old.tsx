import React, { useRef, useState, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { makeAutoObservable } from 'mobx';

class ImageStore {
    image: HTMLImageElement | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setImage(image: HTMLImageElement) {
        this.image = image;
    }
}

const imageStore = new ImageStore();

const WebviewPlacePointsOld: React.FC = observer(() => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [positivePoints, setPositivePoints] = useState<Array<{ x: number; y: number }>>([]);
    const [negativePoints, setNegativePoints] = useState<Array<{ x: number; y: number }>>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const formatPointsAndLabels = useCallback(() => {
        const pointsArray = [...positivePoints, ...negativePoints];
        const pointsString = pointsArray.map(point => `[${point.x}, ${point.y}]`).join(', ');

        const labelsArray = positivePoints.map(() => 1).concat(negativePoints.map(() => 0));
        const labelsString = `[${labelsArray.join(', ')}]`;

        const parameters = {
            points: pointsString,
            labels: labelsString,
        };

        // You can now use the 'parameters' object
        console.log(parameters);
    }, [positivePoints, negativePoints]);

    useEffect(() => {
        formatPointsAndLabels();
    }, [positivePoints, negativePoints, formatPointsAndLabels]);

    const drawPoints = useCallback(() => {
        const canvas = canvasRef.current;
        if (canvas && imageStore.image) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(imageStore.image, 0, 0, canvas.width, canvas.height);

                ctx.fillStyle = 'red';
                positivePoints.forEach((point) => {
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
                    ctx.fill();
                });

                ctx.fillStyle = 'blue';
                negativePoints.forEach((point) => {
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
                    ctx.fill();
                });
            }
        }
    }, [positivePoints, negativePoints]);


    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLCanvasElement>) => {
            if (imageStore.image) {
                e.preventDefault();
                const canvas = canvasRef.current;
                if (canvas) {
                    const rect = canvas.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const point = { x, y };

                    if (e.button === 0) {
                        setPositivePoints((prevPoints) => [...prevPoints, point]);
                    } else if (e.button === 2) {
                        setNegativePoints((prevBluePoints) => [...prevBluePoints, point]);
                    }
                }
            }
        },
        []
    );


    useEffect(() => {
        drawPoints();
    }, [positivePoints, drawPoints]);
    useEffect(() => {
        drawPoints();
    }, [negativePoints, drawPoints]);



    const handleImageLoad = useCallback(
        (base64: string) => {
            const img = new Image();
            img.src = base64;
            img.onload = () => {
                const canvas = canvasRef.current;
                if (canvas) {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    imageStore.setImage(img);
                    drawPoints();
                }
            };
        },
        [drawPoints]
    );


    const handleDrop = useCallback(
        (e: DragEvent) => {
            e.preventDefault();

            if (e.dataTransfer && e.dataTransfer.items) {
                for (let i = 0; i < e.dataTransfer.items.length; i++) {
                    if (e.dataTransfer.items[i].kind === 'file') {
                        const file = e.dataTransfer.items[i].getAsFile();
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                                const result = reader.result as string;
                                handleImageLoad(result);
                            };
                            reader.readAsDataURL(file);
                        }
                    }
                }
            }
        },
        [handleImageLoad]
    );


    const handleDragOver = useCallback((e: DragEvent) => {
        e.preventDefault();
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('drop', handleDrop, true);
            container.addEventListener('dragover', handleDragOver, true);
        }

        return () => {
            if (container) {
                container.removeEventListener('drop', handleDrop, true);
                container.removeEventListener('dragover', handleDragOver, true);
            }
        };
    }, [handleDrop, handleDragOver]);



    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
            <h2>Webview Place Points</h2>
            <canvas ref={canvasRef} onMouseDown={handleClick} onContextMenu={(e) => e.preventDefault()} />
        </div>
    );
});

export default WebviewPlacePointsOld;
