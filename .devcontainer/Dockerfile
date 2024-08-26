FROM fedora:41

RUN dnf update -y && dnf upgrade -y

RUN dnf install sudo wget vim git just @development-tools -y

# Add custom user "dev" with sudo permissions
RUN useradd dev -u 1000 -m -s /bin/bash && \
	echo "dev ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers
USER dev

RUN curl https://sh.rustup.rs -sSf | bash -s -- -y

ENV PATH="/home/dev/.cargo/bin:${PATH}"

RUN cargo install mdbook

# Terminal prompt customizations
COPY custom/gu /usr/local/bin/gu
COPY custom/.bashrc /home/dev/.bashrc
RUN sudo chown dev:dev /usr/local/bin/gu
RUN sudo chown dev:dev /home/dev/.bashrc
