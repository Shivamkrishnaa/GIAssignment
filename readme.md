
Hi!

#Requirement - OS: MAC

Here is what you should do to run:

1. Install docker and enable kuberentes
2. Install nginx from https://kubernetes.github.io/ingress-nginx/deploy/ or Run 'kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.41.2/deploy/static/provider/cloud/deploy.yaml'
3. Run 'kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf'
4. Step to do only if you are running Docker/Kubernetes on your local machine.
```

   >  A. Push react client to docker
        1. Change into the ‘client’ directory at your terminal
        2. Run ‘docker build -t YOURDOCKERID/client .’
        3. Run ‘docker push YOURDOCKERID/client’
```
```

   >  B. Push server auth to docker
        1. Change into the auth directory at your terminal
        2. Run ‘docker build -t YOURDOCKERID/auth .’
        3. Run ‘docker push YOURDOCKERID/auth

```
```
   >  C. Replace all your docker id
        1. Change into the root’ directory at your terminal
        2. Open skaffold.yaml replace all 'shivamkrishna' with 'YOURDOCKERID'
        3. Change into the infra/k8s directory at your terminal.
        4. Open auth-depl.yaml and client-depl.yaml replace all 'shivamkrishna' with 'YOURDOCKERID'
```

6. Type sudo nano /etc/hosts and press Return
7. Add ` 127.0.0.1       localhost server.com` to your /etc/host
8. Run command skaffold dev
9. Go to your browser and open server.com
