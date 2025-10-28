/*js do site */

// Dados de exemplo para as postagens
const samplePosts = [
  {
    title: "Horta Comunitária no Bairro",
    category: "Alimentação",
    description:
      "Organizamos uma horta comunitária onde vizinhos cultivam alimentos orgânicos juntos. Já colhemos mais de 50kg de verduras e legumes!",
    location: "Curitiba, PR",
    image:
      "https://images.unsplash.com/photo-1591871937571-6d865bc5f127?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    date: "15/10/2023",
  },
  {
    title: "Instalação de Painéis Solares",
    category: "Energia Renovável",
    description:
      "Finalmente instalei painéis solares em casa. Espero reduzir minha conta de energia em 80% e minha pegada de carbono significativamente.",
    location: "Belo Horizonte, MG",
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    date: "10/10/2023",
  },
  {
    title: "Projeto de Compostagem na Escola",
    category: "Reciclagem",
    description:
      "Implementamos um sistema de compostagem na escola dos meus filhos. Agora transformamos resíduos orgânicos em adubo para o jardim.",
    location: "Florianópolis, SC",
    image:
      "https://images.unsplash.com/photo-1589923188651-268a35c0d0bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    date: "05/10/2023",
  },
];

// Função para renderizar as postagens
function renderPosts() {
  const postsContainer = document.getElementById("posts-container");
  postsContainer.innerHTML = "";

  samplePosts.forEach((post) => {
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

// Função para adicionar nova postagem
document
  .getElementById("sustainability-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("action-title").value;
    const category = document.getElementById("action-category").value;
    const description = document.getElementById("action-description").value;
    const location = document.getElementById("action-location").value;
    const image = document.getElementById("action-image").value;

    if (title && category && description) {
      const newPost = {
        title,
        category,
        description,
        location: location || "Local não informado",
        image:
          image ||
          "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        date: new Date().toLocaleDateString("pt-BR"),
      };

      samplePosts.unshift(newPost);
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

// Inicializar a página
document.addEventListener("DOMContentLoaded", function () {
  renderPosts();

  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelector(".nav-links");

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
      }, 5000);
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
