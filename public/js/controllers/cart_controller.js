// Controller do Carrinho com Stimulus.js
// Responsável por: adicionar itens, remover itens, atualizar visualização e salvar no localStorage

import { Controller } from "stimulus";

export default class extends Controller {
  // Targets (elementos HTML controlados pelo controller)
  static targets = [
    "itemsCount",    // Exibe a quantidade de itens no carrinho (ex: badge)
    "itemsList",     // Lista de itens no dropdown/modal do carrinho
    "totalPrice",    // Elemento que mostra o preço total
    "emptyMessage"   // Mensagem "Carrinho vazio"
  ];

  // Valores padrão
  static values = {
    storageKey: { type: String, default: "jm-streetwear-cart" } // Chave do localStorage
  };

  // Inicialização
  connect() {
    this.loadCart(); // Carrega o carrinho ao iniciar
  }

  // --- Métodos Principais ---

  // Adiciona um produto ao carrinho
  addItem(event) {
    const button = event.currentTarget;
    const product = {
      id: button.dataset.productId,       // ID do produto
      name: button.dataset.productName,   // Nome do produto
      price: parseFloat(button.dataset.productPrice), // Preço (convertido para float)
      image: button.dataset.productImage  // URL da imagem
    };

    const cart = this.getCart();
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1; // Incrementa quantidade se o item já existe
    } else {
      product.quantity = 1;
      cart.push(product); // Adiciona novo item
    }

    this.saveCart(cart);
    this.updateCartDisplay();
  }

  // Remove um item do carrinho
  removeItem(event) {
    const productId = event.currentTarget.dataset.productId;
    const cart = this.getCart().filter(item => item.id !== productId);
    this.saveCart(cart);
    this.updateCartDisplay();
  }

  // --- Métodos Auxiliares ---

  // Carrega o carrinho do localStorage
  loadCart() {
    this.updateCartDisplay();
  }

  // Atualiza a visualização do carrinho
  updateCartDisplay() {
    const cart = this.getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Atualiza contador
    if (this.hasItemsCountTarget) {
      this.itemsCountTarget.textContent = totalItems;
      this.itemsCountTarget.classList.toggle("hidden", totalItems === 0);
    }

    // Atualiza lista de itens (ex: dropdown)
    if (this.hasItemsListTarget) {
      this.itemsListTarget.innerHTML = cart.map(item => `
        <div class="cart-item flex justify-between items-center py-2 border-b">
          <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover">
          <div class="flex-1 px-3">
            <h4 class="font-medium">${item.name}</h4>
            <p>${item.quantity} x R$ ${item.price.toFixed(2)}</p>
          </div>
          <button data-action="cart#removeItem" 
                  data-product-id="${item.id}"
                  class="text-red-500 hover:text-red-700">
            ✕
          </button>
        </div>
      `).join("");

      this.itemsListTarget.classList.toggle("hidden", cart.length === 0);
    }

    // Atualiza preço total
    if (this.hasTotalPriceTarget) {
      this.totalPriceTarget.textContent = `R$ ${totalPrice.toFixed(2)}`;
    }

    // Mostra/oculta mensagem "vazio"
    if (this.hasEmptyMessageTarget) {
      this.emptyMessageTarget.classList.toggle("hidden", cart.length > 0);
    }
  }

  // Retorna o carrinho atual (array)
  getCart() {
    return JSON.parse(localStorage.getItem(this.storageKeyValue)) || [];
  }

  // Salva o carrinho no localStorage
  saveCart(cart) {
    localStorage.setItem(this.storageKeyValue, JSON.stringify(cart));
  }
}