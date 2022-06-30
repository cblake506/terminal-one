const createNote = async (event) => {
    event.preventDefault();

    // Collect values from the note form
    const note_title = document.querySelector('#TitleInput').value.trim();
    const note_content = document.querySelector('#note-input').value;

    if (note_title && note_content) {
        // Send a POST request to the API endpoint
        const response = await fetch('http://localhost:3001/api/notes', {
            method: 'POST',
            body: JSON.stringify({ note_title, note_content }),
            headers: { 'Content-Type': 'application/json'},
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

