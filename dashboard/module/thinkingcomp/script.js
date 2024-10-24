const draggableList = document.getElementById('draggable-list');
const listItems = document.querySelectorAll('#draggable-list li');
let draggedItem = null;

listItems.forEach(item => {
    item.addEventListener('dragstart', function() {
        draggedItem = item;
        setTimeout(() => {
            item.classList.add('dragging');
        }, 0);
    });

    item.addEventListener('dragend', function() {
        setTimeout(() => {
            draggedItem = null;
            item.classList.remove('dragging');
        }, 0);
    });

    item.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

    item.addEventListener('dragenter', function(e) {
        e.preventDefault();
    });

    item.addEventListener('drop', function() {
        if (draggedItem !== this) {
            let allItems = Array.from(draggableList.children);
            let draggedIndex = allItems.indexOf(draggedItem);
            let droppedIndex = allItems.indexOf(this);
            
            if (draggedIndex < droppedIndex) {
                draggableList.insertBefore(draggedItem, this.nextSibling);
            } else {
                draggableList.insertBefore(draggedItem, this);
            }
        }
    });
});

document.getElementById('submit-answer').addEventListener('click', function() {
    const order = Array.from(draggableList.children)
                      .map(item => item.dataset.order)
                      .join('-');

    const correctOrder = 'D-A-C-B';

    if (order === correctOrder) {
        alert('Selamat! Jawaban Anda benar.');
    } else {
        alert('Jawaban Anda salah. Coba lagi!');
    }
});
