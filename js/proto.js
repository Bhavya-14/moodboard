window.addEventListener('load', () => {
    const images = document.querySelectorAll('.img-container img');
    const columnCount = 3;
    const columnWidth = 180;
    const gap = 5;
    const columns = Array(columnCount).fill(0);

    const container = document.querySelector('.img-container');
    container.classList.add('img-container-positioned');

    // 1. Position images in masonry layout
    images.forEach((img) => {
        img.classList.add('masonry-img');
        img.setAttribute('data-x', 0);
        img.setAttribute('data-y', 0);

        const minColumnIndex = columns.indexOf(Math.min(...columns));
        const x = minColumnIndex * (columnWidth + gap) + 500;
        const y = columns[minColumnIndex] + 50;

        img.style.left = `${x}px`;
        img.style.top = `${y}px`;

        columns[minColumnIndex] += img.offsetHeight + gap;
    });

    let isDraggingOrResizing = false;
    let clickTimeout;

    // 2. Enable drag and resize using Interact.js
    interact('.img-container img')
        .draggable({
            listeners: {
                start(event) {
                    isDraggingOrResizing = true;
                },
                move(event) {
                    const target = event.target;
                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                    target.style.transform = `translate(${x}px, ${y}px)`;
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                },
                end(event) {
                    isDraggingOrResizing = false;
                }
            }
        })
        .resizable({
            edges: { left: true, right: true, bottom: true, top: true }
        })
        .on('resizemove', function (event) {
            const target = event.target;
            let { width, height } = event.rect;

            target.style.width = `${width}px`;
            target.style.height = `${height}px`;

            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.deltaRect.left;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.deltaRect.top;

            target.style.transform = `translate(${x}px, ${y}px)`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        });

    // 3. Popup logic
    let selectedMainImage = null;
    let selectedPopupImageSrc = null;

    const popup = document.createElement('div');
    popup.classList.add('popup');
    document.body.appendChild(popup);

    const popupGallery = document.createElement('div');
    popupGallery.className = 'popup-gallery';
    popup.appendChild(popupGallery);

    const btnContainer = document.createElement('div');
    btnContainer.className = 'popup-buttons';

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete Image';

    const cancelBtn = document.createElement('button');
    cancelBtn.innerText = 'Cancel';

    const replaceBtn = document.createElement('button');
    replaceBtn.innerText = 'Replace Image';
    replaceBtn.disabled = true;

    const addBtn = document.createElement('button');
    addBtn.innerText = 'Add Image';
    addBtn.disabled = true;

    btnContainer.appendChild(deleteBtn);
    btnContainer.appendChild(cancelBtn);
    btnContainer.appendChild(replaceBtn);
    btnContainer.appendChild(addBtn);
    popup.appendChild(btnContainer);

    // 4. On image click – open popup with delay (only if not dragging/resizing)
    images.forEach((img) => {
        img.addEventListener('click', () => {
            if (!isDraggingOrResizing) {
                clearTimeout(clickTimeout); // Clear previous timeout if any
                clickTimeout = setTimeout(() => {
                    selectedMainImage = img;
                    popup.style.display = 'block';
                    selectedPopupImageSrc = null;
                    replaceBtn.disabled = true;
                    addBtn.disabled = true;
                }, 150); // Short delay before opening the popup
            }
        });
    });

    // 5. Load images into popup
    const sources = ['a1.png', 'a2.png', 'a3.png', 'a4.png', 'a5.png', 'a6.png'];
    popupGallery.innerHTML = '';
    sources.forEach(src => {
        const pImg = document.createElement('img');
        pImg.src = `./assets/protoType_images/${src}`;
        pImg.className = 'popup-gallery-img';

        pImg.addEventListener('click', () => {
            popupGallery.querySelectorAll('img').forEach(img => {
                img.classList.remove('selected');
            });

            pImg.classList.add('selected');
            selectedPopupImageSrc = pImg.src;

            replaceBtn.disabled = false;
            addBtn.disabled = false;
        });

        popupGallery.appendChild(pImg);
    });

    // 6. Delete button logic
    deleteBtn.addEventListener('click', () => {
        if (selectedMainImage) {
            selectedMainImage.remove();
            popup.style.display = 'none';
        }
    });

    cancelBtn.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    // 7. Replace button logic
    replaceBtn.addEventListener('click', () => {
        if (selectedMainImage && selectedPopupImageSrc) {
            selectedMainImage.src = selectedPopupImageSrc;
            popup.style.display = 'none';
        }
    });

    // 8. Add button logic
    addBtn.addEventListener('click', () => {
        if (selectedPopupImageSrc) {
            const newImg = document.createElement('img');
            newImg.src = selectedPopupImageSrc;
            newImg.className = 'masonry-img';
            newImg.setAttribute('data-x', 0);
            newImg.setAttribute('data-y', 0);
            newImg.style.left = '50vw';
            newImg.style.top = '40vh';

            container.appendChild(newImg);

            interact(newImg)
                .draggable({
                    listeners: {
                        move(event) {
                            const target = event.target;
                            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                            target.style.transform = `translate(${x}px, ${y}px)`;
                            target.setAttribute('data-x', x);
                            target.setAttribute('data-y', y);
                        }
                    }
                })
                .resizable({
                    edges: { left: true, right: true, bottom: true, top: true }
                })
                .on('resizemove', function (event) {
                    const target = event.target;
                    let { width, height } = event.rect;

                    target.style.width = `${width}px`;
                    target.style.height = `${height}px`;

                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.deltaRect.left;
                    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.deltaRect.top;

                    target.style.transform = `translate(${x}px, ${y}px)`;
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                });

            popup.style.display = 'none';
        }
    });
});
