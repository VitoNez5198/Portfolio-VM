document.getElementById('copyEmailButton').addEventListener('click', async () => {
    const emailInput = document.getElementById('email');
    
    try {
        // Usar el nuevo API de portapapeles
        await navigator.clipboard.writeText(emailInput.value);
        
        const copyMessage = document.getElementById('copyMessage');
        copyMessage.style.display = 'inline'; // Muestra el mensaje
        setTimeout(() => {
            copyMessage.style.display = 'none'; // Oculta el mensaje después de 2 segundos
        }, 2000);
    } catch (err) {
        console.error('Error al copiar el correo: ', err);
    }
});
