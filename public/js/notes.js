const createNote = async (event) => {
    event.preventDefault();

    // Collect values from the note form
    const note_title = document.querySelector('#TitleInput').value.trim();
    const note_content = document.querySelector('#note-input').value;

    if (note_title && note_content) {
        // Send a POST request to the API endpoint
        const response = await fetch('/api/notes', {
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


const onSelectionChanged = async (note_id, user_id) =>{
    const response = await fetch('/api/notes/share', {
        method: 'POST',
        body: JSON.stringify({ note_id, user_id }),
        headers: { 'Content-Type': 'application/json'},
    })
    if (response.ok)
        console.log('note has been shared');
    document.getElementById('userSelect').remove();
}

const shareNote = async (noteId) => {

    const result = await fetch('/api/users/notme')
    const users = await result.json();

    var select = document.createElement("select");
    select.name = "users";
    select.id = "userSelect"
 
    var option = document.createElement("option");
    option.value = 0;
    option.text = 'Share with';
    option.setAttribute('disabled', 'true');
    option.setAttribute('selected', 'true');
    select.appendChild(option);
    for (const u of users)
    {
        var option = document.createElement("option");
        option.value = u.id;
        option.text = u.userName;
        select.appendChild(option);
    }
    select.setAttribute('onchange', `onSelectionChanged(${noteId}, this.options[this.selectedIndex].value)`);
 
    document.getElementById(`noteCard${noteId}`).appendChild(select);
}

const deleteNote = async (noteId) => {
    //todo: change confirm for modal
    const answer = confirm('Are you sure you want to delete this note?');
    if (answer === false)
        return;

    {    
        var res = await fetch(`/api/notes/${noteId}`,{
            method: 'DELETE'
        });
        if(res.ok)
            document.location.reload();
    }
}


const filterNotes = async (event) => {
    //event.preventDefault();
    const needle = document.getElementById('searchNotesInput').value.toLowerCase();
    let haystack = document.getElementsByClassName('note-card');
    for (h of haystack){
        let title = h.children[0].children[0].innerHTML.toLowerCase();
        let content = h.children[1].innerHTML.toLowerCase();
        if(!title.includes(needle) && !content.includes(needle))
            h.classList.add('almost-invisible');
        else
            h.classList.remove('almost-invisible');
    }
}

const handleClick = async (event) => {
    if (!event.target.id || event.target.id !== 'userSelect'){
        var currentSelect = document.getElementById("userSelect");
        if (currentSelect !== null)
        currentSelect.remove();
    }
}

document
    .querySelector('#createNote')
    .addEventListener('submit', createNote);

document
    .querySelector('#searchForm')
    .addEventListener('submit', filterNotes);

document.getElementById('searchNotesInput').addEventListener('input', filterNotes);

document.addEventListener('click', handleClick);