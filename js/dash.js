document.addEventListener('DOMContentLoaded', () => {
    const deleteButton = document.querySelectorAll('.delete-btn');
    deleteButton.forEach(button => {
        button.addEventListener('click', () => {
            const projectCard = button.closest('.project-card');
            if (projectCard) {
                projectCard.remove();
            }
        })
    })
})      