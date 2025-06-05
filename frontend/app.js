const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const mentalLoadInput = document.getElementById('mental-load');
const taskList = document.getElementById('task-list');
const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Fonction pour découper automatiquement une tâche (simulé)
function decouperTache(text) {
  if (text.includes(';')) {
    return text.split(';').map(t => t.trim());
  }
  return [text];
}

// Fonction pour suggérer des sous-tâches (simulé)
function suggererTaches(text) {
  if (text.toLowerCase().includes('préparer')) {
    return ['Lister les étapes', 'Aller chercher les outils', 'Vérifier les prérequis'];
  }
  if (text.toLowerCase().includes('ranger')) {
    return ['Classer les dossiers', 'Trier les objets inutiles', 'Nettoyer l\'espace'];
  }
  return [];
}

// Fonction pour prioriser les tâches (simulé)
function prioriserTaches(taches) {
  return taches.sort((a, b) => b.mentalLoad - a.mentalLoad);
}

// Ajouter une tâche
function ajouterTache(text, mentalLoad, assignedTo, color) {
  const sousTaches = decouperTache(text);
  sousTaches.forEach(st => {
    tasks.push({
      id: Date.now() + Math.random(),
      text: st,
      mentalLoad: Number(mentalLoad) || 1,
      assignedTo: assignedTo || 'Non assigné',
      color: color || '#ffffff'
    });
  });
  tasks.sort((a, b) => b.mentalLoad - a.mentalLoad);
  saveTasks();
  renderTasks();
}

// Supprimer une tâche
function supprimerTache(id) {
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

// Sauvegarder les tâches dans localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
      const col = document.createElement('div');
      col.className = 'col-12 col-md-6 col-lg-4';
  
      const card = document.createElement('div');
      card.className = 'card';
  
      const cardBody = document.createElement('div');
      cardBody.className = 'card-body d-flex flex-column';
  
      // Titre (affiché dans une div avec couleur de fond)
      const taskText = document.createElement('div');
      taskText.className = 'p-2 mb-2 rounded'; 
      taskText.style.backgroundColor = task.color;
      taskText.style.color = '#000'; // ou blanc si fond foncé, à ajuster selon besoin
      taskText.innerHTML = `<strong>${task.text}</strong>`;
  
      // Assignation
      const assignedTo = document.createElement('p');
      assignedTo.innerHTML = `<strong>Affecté à :</strong> ${task.assignedTo}`;
      assignedTo.className = 'text-muted mb-2';
  
      // Indicateur de charge mentale
      const mentalLoadEmoji = ['1', '2', '3', '4', '5'][Math.min(Math.max(task.mentalLoad-1, 0), 4)];
      const mentalLoadIndicator = document.createElement('div');
      mentalLoadIndicator.textContent = `Charge mentale : ${mentalLoadEmoji}`;
  
      // Groupe de boutons
      const btnGroup = document.createElement('div');
      btnGroup.className = 'd-flex justify-content-between align-items-center mt-3';
  
      // Bouton Modifier
      const editBtn = document.createElement('button');
      editBtn.className = 'btn btn-sm btn-outline-primary';
      editBtn.textContent = '✏️ Modifier';
      editBtn.onclick = () => {
        // Mode édition inline
        taskText.innerHTML = `
          <input type="text" class="form-control mb-2" value="${task.text}" id="editText${task.id}">
          <input type="color" class="form-control form-control-color mb-2" value="${task.color}" id="editColor${task.id}">
        `;
        taskText.style.backgroundColor = 'transparent';
  
        assignedTo.innerHTML = `<strong>Affecté à :</strong> 
          <input type="text" class="form-control mb-2" value="${task.assignedTo}" id="editAssigned${task.id}">`;
  
        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn btn-sm btn-success me-2';
        saveBtn.textContent = '💾 Enregistrer';
        saveBtn.onclick = () => {
          const newText = document.getElementById(`editText${task.id}`).value;
          const newAssigned = document.getElementById(`editAssigned${task.id}`).value;
          const newColor = document.getElementById(`editColor${task.id}`).value;
          task.text = newText;
          task.assignedTo = newAssigned;
          task.color = newColor;
          saveTasks();
          renderTasks();
        };
  
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn btn-sm btn-secondary';
        cancelBtn.textContent = '✖️ Annuler';
        cancelBtn.onclick = () => renderTasks();
  
        btnGroup.innerHTML = '';
        btnGroup.appendChild(saveBtn);
        btnGroup.appendChild(cancelBtn);
      };
  
      // Bouton Supprimer
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-sm btn-outline-danger';
      deleteBtn.textContent = '🗑️ Supprimer';
      deleteBtn.onclick = () => supprimerTache(task.id);
  
      // Bouton Suggestions
      const suggestBtn = document.createElement('button');
      suggestBtn.className = 'btn btn-sm btn-outline-info';
      suggestBtn.textContent = '💡';
      suggestBtn.onclick = () => {
        const suggestions = suggererTaches(task.text);
        if (suggestions.length === 0) {
          alert('Pas de suggestions pour cette tâche.');
        } else {
          alert('Suggestions:\n' + suggestions.join('\n'));
        }
      };
  
      btnGroup.appendChild(suggestBtn);
      btnGroup.appendChild(editBtn);
      btnGroup.appendChild(deleteBtn);
  
      cardBody.appendChild(taskText);
      cardBody.appendChild(assignedTo);
      cardBody.appendChild(mentalLoadIndicator);
      cardBody.appendChild(btnGroup);
  
      card.appendChild(cardBody);
      col.appendChild(card);
      taskList.appendChild(col);
    });
  }
  

// Événement formulaire
taskForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = taskInput.value.trim();
  const mentalLoad = mentalLoadInput.value.trim();
  const assignedTo = document.getElementById('assigned-to').value.trim();
  const color = document.getElementById('task-color').value;

  if (text !== '') {
    ajouterTache(text, mentalLoad, assignedTo, color);
    taskInput.value = '';
    mentalLoadInput.value = '';
    document.getElementById('assigned-to').value = '';
    document.getElementById('task-color').value = '#ffffff';
  }
});

// Commande vocale
document.getElementById('voice-btn').addEventListener('click', () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'fr-FR';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    taskInput.value = event.results[0][0].transcript;
  };

  recognition.start();
});

// Exporter JSON
function exportTasks() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
  const dlAnchorElem = document.createElement('a');
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "tasks.json");
  dlAnchorElem.click();
}

document.getElementById('ai-btn').addEventListener('click', async () => {
  const text = taskInput.value.trim();
  const mentalLoad = mentalLoadInput.value.trim();
  const assignedTo = document.getElementById('assigned-to').value.trim();
  const color = document.getElementById('task-color').value;

  if (text === '') {
    alert("Merci de saisir une tâche !");
    return;
  }

  try {
    // Appel à l'API Mistral (mock ici)
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer VOTRE_CLE_API'  // Remplacez par votre clé
      },
      body: JSON.stringify({
        model: "mistral-medium",  // ou mistral-small / mistral-large selon votre plan
        messages: [
          {
            role: "system",
            content: "Tu es un assistant qui aide à découper une tâche en sous-tâches claires et concises."
          },
          {
            role: "user",
            content: `Voici ma tâche principale : "${text}". Peux-tu me donner une liste de sous-tâches pour la réaliser ?`
          }
        ]
      })
    });

    const data = await response.json();
    const aiText = data.choices[0].message.content;

    // Découper la réponse en sous-tâches (ex: "- sous-tâche 1\n- sous-tâche 2\n...")
    const sousTaches = aiText
      .split('\n')
      .map(line => line.replace(/^- /, '').trim())
      .filter(line => line.length > 0);

    // Ajoute chaque sous-tâche (ou la tâche principale s'il n'y a pas eu de découpage)
    if (sousTaches.length > 0) {
      sousTaches.forEach(st => {
        ajouterTache(st, mentalLoad, assignedTo, color);
      });
    } else {
      ajouterTache(text, mentalLoad, assignedTo, color);
    }

    // Réinitialiser les champs
    taskInput.value = '';
    mentalLoadInput.value = '';
    document.getElementById('assigned-to').value = '';
    document.getElementById('task-color').value = '#ffffff';

  } catch (error) {
    console.error(error);
    alert("Une erreur est survenue lors de la génération des sous-tâches.");
  }
});


// Initialiser
renderTasks();
