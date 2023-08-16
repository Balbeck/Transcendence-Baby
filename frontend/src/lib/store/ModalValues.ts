// { writable } permet l'export et le dereferencement de la value (like une Globale)
import { writable } from "svelte/store";


// Affichage ou non d'une fenetre (a 'Modal') 
export let showModal = writable(false);
// Page a afficher dans la fenetre (dans la 'Modal')
export let selectedPage = writable("none");

// Functions pour Ouvrir / Fermer la Modal
export function openModal(page: string) {
	showModal.set(true);
	selectedPage.set(page);
}
export function closeModal() {
	showModal.set(false);
	selectedPage.set("none");
}

export let errorMsg = writable("");

