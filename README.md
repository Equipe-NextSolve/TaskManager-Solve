
# Bibliotecas utilizadas:
 - Componentes:
     - @mui/material (Material-UI): Biblioteca de componentes prontos do Google Material Design.
     - @mui/icons-material: Pacote oficial de ícones do Material Design.

 - React-icons: Coleção gigante de ícones de várias bibliotecas (FontAwesome, Feather, Bootstrap etc).

 - Sonner: Biblioteca de notificações (toasts), Após criar um projeto, aparece uma mensagem verde no canto da tela.

 - emailjs: Serviço que envia email direto do frontend, Quando um dev clica "Solicitar projeto", o gerente recebe email na hora.

 - date-fns: Biblioteca para manipular datas de forma simples, Ex: format(project.deadline, 'dd/MM/yyyy') mostra "25/03/2026".

 - Firebase:
   - firebase: Biblioteca para conectar com Firebase pelo navegador, Quando um dev muda o status do projeto, o Firebase atualiza em tempo real para o gerente.
   - firebase-admin: Versão servidor do Firebase (roda nas API Routes do Next.js), A ação de promover alguém a admin só pode ser feita pelo backend com firebase-admin.

 - react-hook-form: Biblioteca para gerenciar formulários de forma performática, Evita re-renders desnecessários e reduz código em ~70% comparado a usar useState.

 - yup: Biblioteca de validação de dados, Impedir que alguém crie projeto sem título ou com prazo no passado.

 - @hookform/resolvers: Conector que faz o react-hook-form funcionar com yup, Passa as regras do yup para o react-hook-form

 - zustand: Gerenciador de estado global (mais simples que Redux), O nome do usuário aparece no canto da tela em qualquer página sem precisar buscar de novo.
 - Autenticação:
   - jsonwebtoken: Biblioteca para criar e verificar tokens de autenticação
   - cookie: Biblioteca para manipular cookies, Ex: Controlar os 20 dias de inatividade
   - bcryptjs: Biblioteca para criptografar senhas

 - recharts: Biblioteca de gráficos para React, Um gráfico de barras mostrando quantos projetos foram finalizados em cada mês.

 - lodash: Biblioteca com funções úteis para manipular dados, debounce faz a busca só aparecer depois que o usuário para de digitar.

 - uuid: Biblioteca para gerar IDs únicos