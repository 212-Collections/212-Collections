# Création et configuration de votre base de données

---

## Étape 1: Création de la base de données

1. Créez un compte MongoDB en vous rendant sur [https://account.mongodb.com/account/register](https://account.mongodb.com/account/register). Assurez-vous de vérifier votre adresse e-mail pour activer votre compte.
2. Une fois connecté, cliquez sur `Build a Database` pour commencer la création de votre base de données.
3. Choisissez l'option qui convient le mieux, y compris l'option gratuite.
4. Sélectionnez le fournisseur d'hébergement de votre choix (Amazon, Google ou Microsoft) ainsi que la région souhaitée pour l'emplacement de vos données.
5. Définissez le nom du cluster. Vous pouvez utiliser le nom par défaut "Cluster0".
6. Cliquez sur `Create` pour lancer la création de votre base de données.

## Étape 2: Création d'un utilisateur d'accès

1. Une fois que votre cluster est créé, créez un utilisateur qui vous permettra de vous connecter à votre base de données. Cet utilisateur sera utilisé pour accéder à votre base de données depuis 212-Collections.
2. Accédez à l'onglet `Database Access` dans la section `Security` pour ajouter un nouvel utilisateur.
3. Choisissez la méthode d'authentification `Password` et attribuez un nom d'utilisateur et un mot de passe.
4. Sélectionnez un rôle approprié pour l'utilisateur. Par exemple, vous pouvez choisir `Read and write to any database` ou `Atlas admin` pour permettre la lecture et la modification de la base de données.
5. Cliquez sur `Add User` pour créer l'utilisateur avec les informations fournies.

## Étape 3: Configuration des autorisations d'accès

1. Accédez à l'onglet `Network Access` dans la section `Security` pour configurer les autorisations d'accès à votre base de données.
2. Cliquez sur `Add IP Address` pour spécifier les adresses IP autorisées à accéder à votre base de données.
   - Vous pouvez choisir `ALLOW ACCESS FROM ANYWHERE` pour permettre l'accès à votre base de données depuis n'importe quelle adresse IP. Notez que cela peut présenter des risques de sécurité.
   - Pour une meilleure sécurité, vous pouvez spécifier une adresse IP spécifique en choisissant `ADD CURRENT IP ADDRESS` ou en ajoutant manuellement une adresse IP. Assurez-vous de prendre en compte que les adresses IP des ordinateurs peuvent changer.
3. Cliquez sur `Confirm` pour enregistrer les modifications et mettre à jour les autorisations d'accès.

## Étape 4: Récupération du lien vers votre cluster

1. Pour trouver le lien de votre cluster (où votre base de données est stockée), accédez à l'onglet `Database` dans la section `Deployment`
2. Cliquez sur `Connect` à côté du nom de votre cluster pour afficher les options de connexion.
3. Sélectionnez l'option `Connect with MongoDB Compass` pour obtenir le lien de connexion à utiliser dans MongoDB Compass.
4. Lien de connexion est de la forme `mongodb+srv://<user>:<password>@<le_lien_du_cluster>/`. Le lien de votre cluster est la partie `<le_lien_du_cluster>` qui se trouve juste après le caractère `@`.

Pour vous connecter sur 212-Collections, utilisez les identifiants que vous avez créés à l'étape 2, ainsi que le lien du cluster obtenu à l'étape 4. Assurez-vous de garder vos informations d'identification sécurisées et de mettre à jour les autorisations d'accès selon vos besoins.