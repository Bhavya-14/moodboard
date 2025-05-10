window.addEventListener('load', () => {
    const images = document.querySelectorAll('.img-container img');
    const columnCount = 3;
    const columnWidth = 180;
    const gap = 5;
    const columns = Array(columnCount).fill(0);

    const container = document.querySelector('.img-container');
    container.classList.add('img-container-positioned');

    // Calculate total width of all columns including gaps
    const totalLayoutWidth = columnCount * columnWidth + (columnCount - 1) * gap;

    // Calculate horizontal offset to center the layout in the container
    const containerWidth = container.offsetWidth;
    const xOffset = (containerWidth - totalLayoutWidth) / 2;

    // Position images in masonry layout
    images.forEach((img) => {
        img.classList.add('masonry-img');
        img.setAttribute('data-x', 0);
        img.setAttribute('data-y', 0);

        const minColumnIndex = columns.indexOf(Math.min(...columns));
        const x = xOffset + minColumnIndex * (columnWidth + gap);
        const y = columns[minColumnIndex] + 30;

        img.style.left = `${x}px`;
        img.style.top = `${y}px`;

        columns[minColumnIndex] += img.offsetHeight + gap;
    });

    // 2. Enable drag and resize using Interact.js
    interact('.img-container img')
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

    // 3. Popup logic
    let selectedMainImage = null;
    let selectedPopupImageSrc = null;

    const popup = document.createElement('div');
    popup.classList.add('popup');
    document.body.appendChild(popup);

    const popupGallery = document.createElement('div');
    popupGallery.className = 'popup-gallery';

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
    popup.appendChild(popupGallery);

    // 4. On image click – open popup
    images.forEach((img) => {
        img.addEventListener('click', () => {
            if (img.classList.contains('border-active')) {
                img.classList.remove('border-active');
                if (deleteBtn) {
                    deleteBtn.style.display = 'none'; // Hide the button when the image is deselected
                }

            }
            else {
                images.forEach((img) => {
                    img.classList.remove('border-active');

                })
                img.classList.add('border-active');


            }
        });
        img.addEventListener('dblclick', () => {
            selectedMainImage = img;
            popup.style.display = 'block'; // or 'block', depending on your CSS
            deleteBtn.style.display = 'inline-block';
            replaceBtn.disabled = true;
            addBtn.disabled = true;
            popupGallery.querySelectorAll('img').forEach(pImg => {
                pImg.classList.remove('selected');
            });

            selectedPopupImageSrc = null;
        })
    });


    // 5. Load images into popup
    const sources = ['a11.png', 'a12.png', 'a13.png', 'a14.png', 'a15.png', 'a16.png'];
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

            newImg.addEventListener('click', () => {
                if (newImg.classList.contains('border-active')) {
                    newImg.classList.remove('border-active');
                    if (deleteBtn) {
                        deleteBtn.style.display = 'none'; // Hide the button when the image is deselected
                    }

                }
                else {
                    images.forEach((newImg) => {
                        newImg.classList.remove('border-active');

                    })
                    newImg.classList.add('border-active');


                }
            });

            newImg.addEventListener('dblclick', () => {
                selectedMainImage = newImg;
                popup.style.display = 'block'; // or 'block', depending on your CSS
                deleteBtn.style.display = 'inline-block';
                replaceBtn.disabled = true;
                addBtn.disabled = true;
                popupGallery.querySelectorAll('img').forEach(pImg => {
                    pImg.classList.remove('selected');
                });

                selectedPopupImageSrc = null;
            })

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

// Color boxes logic (unchanged)
const colorList = ['#C14464', '#957650', '#F4E1C1', '#C89098'];
const colorBoxes = document.querySelectorAll('.color-box');
const colorCodes = document.querySelectorAll('.color-code');

colorBoxes.forEach((colorBox, index) => {
    const hex = colorList[index];
    colorBox.style.backgroundColor = hex;
    colorCodes[index].textContent = hex;
});

// Google fonts logic (unchanged)
const fontList = ['Poppins', 'Playfair Display'];

function loadGoogleFonts(fonts) {
    const formattedFonts = fonts.map(font => font.replace(/ /g, '+')).join('&family=');
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${formattedFonts}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
}

loadGoogleFonts(fontList);

const fontTextEls = document.querySelectorAll('.font p:first-child');
const fontNameEls = document.querySelectorAll('.fontName');

fontTextEls.forEach((el, index) => {
    const font = fontList[index];
    el.style.fontFamily = `'${font}', sans-serif`;
    fontNameEls[index].textContent = font;
});
