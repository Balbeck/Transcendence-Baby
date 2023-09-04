<script lang="ts">
	import { authentificated } from "$lib/store/store";

	export async function checkJWT() {
		const jwt_verifier_url = "http://localhost:3000/auth/verifier_jwt";
		const token = localStorage.getItem("jwt");

		if (!token) {
			return false; // Pas de JWT trouvé
		}

		// Envoyer le JWT au backend pour validation
		try {
			const response = await fetch(jwt_verifier_url, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({}),
			});

			if (response.ok) {
				console.log(" -[ CheckJWT ]- reponse Backend ( OK )");
				authentificated.set(true);
				return true;
			} else {
				console.log(" -[ CheckJWT ]- reponse Backend ( BAD )");
				authentificated.set(false);
				return false;
			}
		} catch (error) {
			return false;
		}
	}
</script>
