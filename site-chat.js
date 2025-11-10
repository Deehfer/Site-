/*js do site */

// Dados de exemplo para as postagens
const samplePosts = [
  {
    title: "Poluição do Ar na Cidade",
    category: "Poluição",
    description:
      "São Paulo tem enfrentado níveis alarmantes de poluição do ar ultimamente. É crucial que tomemos medidas para reduzir as emissões de veículos e indústrias.",
    location: "São Paulo, SP",
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
    location: "Campo Limpo, SP",
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

  currentPosts.forEach((post, index) => {
    const postElement = document.createElement("div");
    postElement.className = "post-card";
    
    // Verificar se a imagem é Base64 ou URL
    let imageStyle = '';
    if (post.image && post.image.startsWith('data:image')) {
      imageStyle = `background-image: url('${post.image}')`;
    } else if (post.image) {
      imageStyle = `background-image: url('${post.image}')`;
    } else {
      imageStyle = 'background-color: #f0f0f0;';
    }
    
    postElement.innerHTML = `
      <div class="post-image" style="${imageStyle}"></div>
      <div class="post-content">
        <h3>${post.title}</h3>
        <div class="post-meta">
          <span><i class="fas fa-tag"></i> ${post.category}</span>
          <span><i class="fas fa-calendar"></i> ${post.date}</span>
        </div>
        <p>${post.description}</p>
        <p><i class="fas fa-map-marker-alt"></i> ${post.location}</p>
      </div>`;
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
function setupFormListener() {
  const form = document.getElementById("sustainability-form");
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const title = document.getElementById("action-title").value;
      const category = document.getElementById("action-category").value;
      const description = document.getElementById("action-description").value;
      const location = document.getElementById("action-location").value;
      const cep = document.getElementById("action-locationCEP").value;
      const imageUrl = document.getElementById("action-image").value;
      const imageFile = document.getElementById("action-image-file").files[0];

      let finalImageUrl = imageUrl;

       if (imageFile) {
        try {
          // Converter imagem para Base64
          finalImageUrl = await fileToBase64(imageFile);
          console.log("Imagem anexada convertida para Base64");
        } catch (error) {
          console.error('Erro ao processar imagem:', error);
          alert('Erro ao processar a imagem. Tente novamente.');
          return;
        }
      } else {
        // Se não há arquivo, usa a URL
        finalImageUrl = imageUrl;
        console.log("Usando URL da imagem:", imageUrl);
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
          image: finalImageUrl,
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
  }
}

// Função para limpar todas as postagens (opcional - para desenvolvimento)
function clearAllPosts() {
  if (confirm("Tem certeza que deseja limpar todas as postagens?")) {
    localStorage.removeItem('sustainabilityPosts');
    // Recarrega as postagens padrão
    savePosts(samplePosts);
    renderPosts();
  }
}

/* Funcionalidade do Popup do Clima */

// Elementos do clima
let weatherBtn, weatherPopup, closeWeather;

function initializeWeather() {
  weatherBtn = document.getElementById("weatherBtn");
  weatherPopup = document.getElementById("weatherPopup");
  closeWeather = document.getElementById("closeWeather");

  // Abrir popup do clima
  if (weatherBtn) {
    weatherBtn.addEventListener("click", function() {
      if (weatherPopup) {
        weatherPopup.style.display = "block";
      }
    });
  }

  // Fechar popup do clima
  if (closeWeather) {
    closeWeather.addEventListener("click", function() {
      if (weatherPopup) {
        weatherPopup.style.display = "none";
      }
    });
  }

  // Fechar popup ao clicar fora
  window.addEventListener("click", function(event) {
    if (weatherPopup && event.target === weatherPopup) {
      weatherPopup.style.display = "none";
    }
  });
}

// Inicializar a página
document.addEventListener("DOMContentLoaded", function () {
  // Configurar formulário
  setupFormListener();
  
  // Renderizar postagens
  renderPosts();

  // Configurar menu mobile
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
  const loginLink = document.querySelector('a[href="#login"]');
  const loginPopup = document.getElementById("loginPopup");

  if (loginLink && loginPopup) {
    loginLink.addEventListener("click", function (e) {
      e.preventDefault();
      loginPopup.style.display = "flex";
    });
  }

    // Formulário de login
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    
    const ra = document.getElementById("text").value;
    const imageFile = document.getElementById("action-image-file").files[0];

    if (!ra || !imageFile) {
      alert("Por favor, preencha o RA e selecione uma imagem.");
      return;
    }

    try {
      // Criar FormData para enviar a imagem
      const formData = new FormData();
      formData.append("imagem", imageFile);

      // Fazer requisição para a API de reconhecimento
      const response = await fetch('http://localhost:8080/api/facial/reconhecer', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erro no reconhecimento facial');
      }

      const resultado = await response.json();

      // Verificar se o RA reconhecido coincide com o informado
      if (resultado.ra === ra) {
        alert("Login realizado com sucesso!");
        // Redirecionar ou executar ações pós-login aqui
      } else {
        alert("Falha no login: RA não corresponde ao reconhecimento facial.");
      }

    } catch (error) {
      console.error('Erro:', error);
      alert("Erro durante o reconhecimento facial. Tente novamente.");
    } finally {
      closeLoginPopup();
    }
  });
}

  // Inicializar chat
  //initializeChat();

  // Inicializar clima
  initializeWeather();

  // Fechar popups com Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (chatActive) {
        closeChat();
      }
      if (weatherPopup && weatherPopup.style.display === 'block') {
        weatherPopup.style.display = "none";
      }
      if (loginPopup && loginPopup.style.display === 'flex') {
        closeLoginPopup();
      }
    }
  });
});

// chat
document.addEventListener("DOMContentLoaded", () => {

  const chatBox = document.getElementById("gg-help-chat");
  const toggleButton = document.getElementById("gg-help-button");
  const minimizeButton = document.getElementById("gg-help-minimize-btn");
  const sendButton = document.getElementById("gg-help-send");
  const inputField = document.getElementById("gg-help-input");
  const chatBody = document.getElementById("gg-help-body");

  toggleButton.addEventListener("click", () => {
    chatBox.style.display = "flex";
    toggleButton.style.display = "none";
    toggleButton.classList.remove("blink");
  });

  minimizeButton.addEventListener("click", ggMinimizeChat);
  
  function ggMinimizeChat() {
    chatBox.classList.add("gg-help-hide");
    setTimeout(() => {
      chatBox.style.display = "none";
      chatBox.classList.remove("gg-help-hide");
      toggleButton.style.display = "flex";
    }, 0); // 300
  }

  const scrollToBottom = () => {
    chatBody.scrollTop = chatBody.scrollHeight;
  };

  const sendMessage = () => {
    const message = inputField.value.trim();
    if (!message) return;

    const userMsg = document.createElement("div");
    userMsg.className = "gg-help-msg-user";
    userMsg.textContent = message;
    chatBody.appendChild(userMsg);
    scrollToBottom();

    const typingIndicator = document.createElement("div");
    typingIndicator.className = "gg-help-typing dot-loader";
    typingIndicator.innerHTML = `Pensando<span>.</span><span>.</span><span>.</span>`;
    chatBody.appendChild(typingIndicator);
    scrollToBottom();

    const chatId = sessionStorage.getItem("chatId") || "chat_" + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem("chatId", chatId);

    fetch('http://localhost:5678/webhook/94b8060b-79fa-46f1-a013-afcb8ee81379/chat', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: chatId,
        chatInput: message,
        route: "general"
      })
    })
    .then(res => res.json())
    .then(data => {
      setTimeout(() => {
        typingIndicator.remove();
        const botMsg = document.createElement("div");
        botMsg.className = "gg-help-msg-bot";
        botMsg.innerHTML = marked.parse(data.output || "Desculpe, não entendi.");
        chatBody.appendChild(botMsg);
        scrollToBottom();
        if (chatBox.style.display === "none") {
          toggleButton.classList.add("blink");
        }
      }, 1000);
    })
    .catch(err => {
      typingIndicator.remove();
      console.error("Erro:", err);
      const errorMsg = document.createElement("div");
      errorMsg.className = "gg-help-msg-bot";
      errorMsg.innerHTML = "<strong>Ops!</strong> Não consegui me conectar. Tente novamente.";
      chatBody.appendChild(errorMsg);
      scrollToBottom();
    });

    inputField.value = "";
  };

  sendButton.addEventListener("click", sendMessage);
  inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

});
