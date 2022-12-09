## Deployment instructions


<details><summary>1. Install Docker and Docker Compose</summary>


**UBUNTU**

- First, update your existing list of packages:
`sudo apt update`

- Next, install a few prerequisite packages which let apt use packages over HTTPS:
`sudo apt install apt-transport-https ca-certificates curl software-properties-common`

- Then add the GPG key for the official Docker repository to your system:
`curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -`

- Add the Docker repository to APT sources:
`sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"`

- Next, update the package database with the Docker packages from the newly added repo:
`sudo apt update`

- Make sure you are about to install from the Docker repo instead of the default Ubuntu repo:
`apt-cache policy docker-ce`

- Finally, install Docker:
`sudo apt install docker-ce`

- Docker should now be installed, the daemon started, and the process enabled to start on boot. Check that it’s running:
`sudo systemctl status docker`

- Executing the Docker Command Without Sudo (Optional):
`sudo usermod -aG docker ${USER}`

- Installing Docker Compose:
`sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose`

- Next, set the correct permissions so that the docker-compose command is executable:
`sudo chmod +x /usr/local/bin/docker-compose`

> For Windows and other operating system you can check the installation guide from `doc.docker.com`
</details>


<details><summary>2. Clone the repository to your server</summary>


- If you have git, push the code to your repository  then clone it to you server

- If you don't have git, upload the code manually to your server

</details>


3. Go to project root

4. For production environment edit the prod.env.sample and for staging environment edit staging.env.sample

<details><summary>5. Fill out required credentials</summary>


_PAYNAMICS_MERCHANT_ID=_

_PAYNAMICS_MERCHANT_KEY=_

_PAYNAMICS_AUTH_USERNAME=_

_PAYNAMICS_AUTH_PASSWORD=_



</details>


<details><summary>6. APP_URL and CSRF_TRUSTED_ORIGINS should be the application domain name</summary>

**Sample**:

_CSRF_TRUSTED_ORIGINS=http://au.phinma.net,https://au.phinma.net_

_APP_URL=https://au.paynamics.net/_



</details>


<details><summary>7. Fill out the captcha keys from your generated reCaptcha</summary>

**Sample:**

_CAPTCHA_SECRET_KEY='12345xxx'_

_CAPTCHA_SITE_KEY='xxx12345'_


> If you don't have reCaptchat keys, you can create one on `https://www.google.com/recaptcha/admin`


</details>

<details><summary>8. Copy and paste the content of .env.sample to .env</summary>

**Sample for Ubuntu:**


- Production environment

`cp prod.env.sample .env`



- Staging environment

`cp staging.env.sample .env`



</details>


9. Run `docker-compose build` to build the app image

10. Run `docker-compose up -d` to run app.
