/*js do site */
/*js do site */

// Dados de exemplo para as postagens
const samplePosts = [
  {
    title: "Poulição do Ar na Cidade",
    category: "Poluição",
    description:
      "São Paulo tem enfrentado níveis alarmantes de poluição do ar ultimamente. É crucial que tomemos medidas para reduzir as emissões de veículos e indústrias.",
    location: "San Paulo, SP",
    image: "https://jornaldia.com.br/wp-content/uploads/2024/09/qualidade-do-ar.webp",
    date: "15/10/2023",
  },
  {
    title: "Queimadas",
    category: "Poluição",
    description:
      "Jundiaí está sofrendo com queimadas frequentes que afetam a qualidade do ar e a saúde dos moradores. Precisamos de políticas mais rigorosas para combater esse problema.",
    location: "Jundiaí, SP",
    image:"https://s2-g1.glbimg.com/7z33oM0DWh-XnFQU6DmmOHlsEbs=/1600x0/filters:format(jpeg)/https://i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2024/d/d/84QXGSR1KL948OU6GF0g/whatsapp-image-2024-09-09-at-16.59.02.jpeg",
    date: "10/10/2023",
  },
  {
    title: "Descarte de resíduo incorreto",
    category: "Descarte",
    description:
      "Campo Limpo tem enfrentado problemas com o descarte inadequado de resíduos sólidos. É essencial promover a conscientização sobre reciclagem e descarte correto.",
    location: "Canpo Limpo, SP",
    image:"https://tse1.mm.bing.net/th/id/OIP.Ve79TtsQnzcoiTIS6pVvaAHaFA?cb=12ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
    date: "05/10/2023",
  },
];

// Função para converter arquivo em Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function obterLocalizacao() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Exibe coordenadas no campo de localização
        document.getElementById("action-location").value = `Lat: ${latitude}, Long: ${longitude}`;

        // Opcional: converter coordenadas em endereço com API externa
        const endereco = await converterCoordenadasParaEndereco(latitude, longitude);
        if (endereco) {
          document.getElementById("action-location").value = endereco;
        }
      },
      function (error) {
        alert("Não foi possível obter sua localização.");
        console.error(error);
      }
    );
  } else {
    alert("Geolocalização não é suportada neste navegador.");
  }
}

async function converterCoordenadasParaEndereco(lat, lon) {
  const apiKey = "SUA_CHAVE_API";
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.results[0].formatted;
  } catch (error) {
    console.error("Erro ao converter coordenadas:", error);
    return null;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const loginLink = document.querySelector('a[href="#login"]');
  const loginPopup = document.getElementById("loginPopup");

  loginLink.addEventListener("click", function (e) {
    e.preventDefault();
    loginPopup.style.display = "flex";
  });
});

function closeLoginPopup() {
  document.getElementById("loginPopup").style.display = "none";
}
// Função para obter as postagens do localStorage ou usar as padrão
function getPosts() {
  const savedPosts = localStorage.getItem('sustainabilityPosts');
  if (savedPosts) {
    return JSON.parse(savedPosts);
  } else {
    // Salva as postagens padrão no localStorage na primeira vez
    savePosts(samplePosts);
    return samplePosts;
  }
}

// Função para salvar as postagens no localStorage
function savePosts(posts) {
  localStorage.setItem('sustainabilityPosts', JSON.stringify(posts));
}

// Função para renderizar as postagens
function renderPosts() {
  const postsContainer = document.getElementById("posts-container");
  postsContainer.innerHTML = "";

  const currentPosts = getPosts();

  currentPosts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className = "post-card";
    postElement.innerHTML = `
      <div class="post-image" style="background-image: url('${post.image}')"></div>
      <div class="post-content">
        <h3>${post.title}</h3>
        <div class="post-meta">
          <span><i class="fas fa-tag"></i> ${post.category}</span>
          <span><i class="fas fa-calendar"></i> ${post.date}</span>
        </div>
        <p>${post.description}</p>
        <p><i class="fas fa-map-marker-alt"></i> ${post.location}</p>
      </div>
    `;
    postsContainer.appendChild(postElement);
  });
}

// Função para mascarar CEP
function mascararCEP(input) {
  let value = input.value.replace(/\D/g, '');
  if (value.length > 5) {
    value = value.substring(0, 5) + '-' + value.substring(5, 8);
  }
  input.value = value;
}

// Função para lidar com tecla Enter no CEP
function handleKeyPress(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
  }
}

// Função para adicionar nova postagem
document
  .getElementById("sustainability-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const title = document.getElementById("action-title").value;
    const category = document.getElementById("action-category").value;
    const description = document.getElementById("action-description").value;
    const location = document.getElementById("action-location").value;
    const cep = document.getElementById("action-locationCEP").value;
    const imageUrl = document.getElementById("action-image").value;
    const imageFile = document.getElementById("action-image-file").files[0];

    let finalImageUrl = imageUrl;

    // Processar imagem anexada
    if (imageFile) {
      try {
        // Converter imagem para Base64
        finalImageUrl = await fileToBase64(imageFile);
      } catch (error) {
        console.error('Erro ao processar imagem:', error);
        alert('Erro ao processar a imagem. Tente novamente.');
        return;
      }
    }

    if (title && category && description) {
      // Combinar CEP com localização se ambos existirem
      let finalLocation = location;
      if (cep && location) {
        finalLocation = `${location} - CEP: ${cep}`;
      } else if (cep) {
        finalLocation = `CEP: ${cep}`;
      } else if (location) {
        finalLocation = location;
      } else {
        finalLocation = "Local não informado";
      }

      const newPost = {
        title,
        category,
        description,
        location: finalLocation,
        image: finalImageUrl || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        date: new Date().toLocaleDateString("pt-BR"),
      };

      // Obter postagens atuais, adicionar nova e salvar
      const currentPosts = getPosts();
      currentPosts.unshift(newPost);
      savePosts(currentPosts);
      
      renderPosts();

      // Limpar o formulário
      this.reset();

      // Mostrar mensagem de sucesso
      alert(
        "Sua ação foi compartilhada com sucesso! Obrigado por contribuir para um planeta mais sustentável."
      );
    } else {
      alert(
        "Por favor, preencha pelo menos a Abertura de Ticket Ambiental, Tipo de Problema e Descrição do Ticket."
      );
    }
  });

// Função para limpar todas as postagens (opcional - para desenvolvimento)
function clearAllPosts() {
  if (confirm("Tem certeza que deseja limpar todas as postagens?")) {
    localStorage.removeItem('sustainabilityPosts');
    // Recarrega as postagens padrão
    savePosts(samplePosts);
    renderPosts();
  }
}

// Inicializar a página
document.addEventListener("DOMContentLoaded", function () {
  renderPosts();

  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const closeMenu = document.getElementById("close-menu");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      navLinks.classList.toggle("active");
    });

    const links = navLinks.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("click", function () {
        navLinks.classList.remove("active");
      });
    });

    if (closeMenu) {
      closeMenu.addEventListener("click", () => {
        navLinks.classList.remove("active");
      });
    }
  }

  // Login button functionality
  const loginButton = document.getElementById("login");
  if (loginButton) {
    loginButton.addEventListener("click", function() {
      alert("Funcionalidade de login em desenvolvimento!");
    });
  }
});
/* js do chat */

// Chatbot Script
// Elementos DOM
const modal = document.getElementById("chatModal");
const userInput = document.getElementById("user-input");
const messagesContainer = document.getElementById("messages");
const typingIndicator = document.getElementById("typingIndicator");
const inactivityMessage = document.getElementById("inactivityMessage");

// Variáveis de estado
let inactivityTimeout;
let chatActive = false;

// Abrir chat
document.getElementById("openChatBtn").onclick = () => {
  openChat();
};

// Fechar chat ao clicar fora da área do chat
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeChat();
  }
});

function openChat() {
  modal.style.display = "block";
  chatActive = true;
  userInput.focus();

  // Limpar mensagens anteriores
  messagesContainer.innerHTML = "";

  // Mensagens de boas-vindas
  addMessage(
    "Olá! Sou o Caquinho, seu assistente virtual! Como posso ajudar você hoje?",
    "bot"
  );
  addMessage(
    "Caso não precisar mais da minha ajuda, digite 'sair' para finalizar.",
    "bot"
  );

  // Iniciar timer de inatividade
  startInactivityTimer();
}

function closeChat() {
  modal.style.display = "none";
  messagesContainer.innerHTML = "";
  userInput.value = "";
  chatActive = false;
  clearTimeout(inactivityTimeout);
  closeInactivityMessage();
}

// Timer de inatividade
function startInactivityTimer() {
  clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(() => {
    if (chatActive) {
      showInactivityMessage();

      // Fechar automaticamente após mostrar o aviso
      setTimeout(() => {
        if (chatActive) {
          closeChat();
        }
      }, 30000);
    }
  }, 30000); // 30 segundos de inatividade
}

function showInactivityMessage() {
  inactivityMessage.style.display = "block";
}

function closeInactivityMessage() {
  inactivityMessage.style.display = "none";
}

// Event listeners para interação do usuário
userInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
  // Reiniciar timer a cada interação
  startInactivityTimer();
});

userInput.addEventListener("input", function () {
  startInactivityTimer();
});

// Enviar mensagem
function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";

  // Mostrar indicador de digitação
  typingIndicator.style.display = "block";

  // Simular resposta do bot
  setTimeout(() => {
    const reply = generateBotReply(message);
    typingIndicator.style.display = "none";
    addMessage(reply, "bot");

    // Verificar se o usuário quer sair
    if (message.toLowerCase().includes("sair")) {
      setTimeout(() => {
        closeChat();
      }, 2000);
    }
  }, 1000 + Math.random() * 1000); // Tempo de resposta variável

  // Reiniciar timer de inatividade
  startInactivityTimer();
}

// Adicionar mensagem ao chat
function addMessage(text, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;
  messageDiv.textContent = text;
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Gerar resposta do bot
function generateBotReply(userMessage) {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("ajuda")) {
    return "Claro! Estou aqui para ajudar. O que você precisa?";
  }
  if (lowerMessage.includes("sair")) {
    return "Até mais! Foi bom conversar com você.";
  }
  if (
    lowerMessage.includes("olá") ||
    lowerMessage.includes("oi") ||
    lowerMessage.includes("ola")
  ) {
    return "Olá! Como posso ajudá-lo hoje?";
  }
  if (lowerMessage.includes("nome")) {
    return "Meu nome é Caquinho! Sou seu assistente virtual.";
  }
  if (lowerMessage.includes("obrigado") || lowerMessage.includes("obrigada")) {
    return "De nada! Estou aqui para ajudar.";
  }

  return "Desculpe, ainda estou aprendendo a responder isso. Pode reformular sua pergunta?";
}
