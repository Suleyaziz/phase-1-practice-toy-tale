let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyDiv = document.getElementById('toy-collection');

  fetch('http://localhost:3000/toys').then(response => response.json()).then(toys => {
    toyDiv.innerHTML = '';
      
    // Create a card for each toy
    toys.forEach(toy => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h2>${toy.name}</h2>
        <img src="${toy.image}" class="toy-avatar" />
        <p>Likes: ${toy.likes}</p>
        <button class="like-btn" id="no.${toy.id}">Like ❤️</button>
      `;
      toyDiv.appendChild(card);
      
      const button = document.getElementById(`no.${toy.id}`);
      const likesDisplay = card.querySelector('p');
      
      button.addEventListener('click', () => {
        const newLikes = toy.likes + 1;
        
        fetch(`http://localhost:3000/toys/${toy.id}`, {
          method: 'PATCH',
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            likes: newLikes
          })
        })
        .then(response => response.json())
        .then(updatedToy => {
          toy.likes = updatedToy.likes;
          likesDisplay.textContent = `Likes: ${updatedToy.likes}`;
        });
      });
    });
  });

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const newToy = {
      name: formData.get('name'),
      image: formData.get('image'),
      likes: 0
    }; 
    
    fetch("http://localhost:3000/toys", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    }).then(response => response.json()).then(createdToy => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h2>${createdToy.name}</h2>
        <img src="${createdToy.image}" class="toy-avatar" />
        <p>Likes: ${createdToy.likes}</p>
        <button class="like-btn" id="no.${createdToy.id}">Like ❤️</button>
      `;
      toyDiv.appendChild(card);
      form.reset();
      toyFormContainer.style.display = "none";
      addToy = false;
    });
  });
});