const createNote = async (event) => {
    event.preventDefault();

    // Collect values from the note form
    const title = document.querySelector('#TitleInput').value.trim();
    const note = document.querySelector('#note-input').value();

    if (title && note) {
        // Send a POST request to the API endpoint
        const response = await fetch('/api/notes', {
            method: 'POST',
            body: JSON.stringify({ title, note }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            //document.location.replace('/notes');
            document.location.reload();
        } else {
            alert(response.statusText);
        }
    }
};

document
    .querySelector('#createNote')
    .addEventListener('submit', createNote);

