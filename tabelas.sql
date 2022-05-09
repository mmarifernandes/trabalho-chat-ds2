
CREATE TABLE public.grupos (
	id varchar NOT NULL,
	nome varchar NOT NULL,
	adm varchar NOT NULL,
	quantidade int4 NOT NULL,
	CONSTRAINT grupos_pk PRIMARY KEY (id)
);



CREATE TABLE public.usuario (
	id varchar NOT NULL,
	nome varchar NOT NULL,
	email varchar NOT NULL,
	senha varchar NOT NULL,
	CONSTRAINT usuario_pk PRIMARY KEY (email)
);


CREATE TABLE public.grupouser (
	grupoid varchar NOT NULL,
	userid varchar NOT NULL,
	tipo varchar NOT NULL,
	CONSTRAINT grupo_user_pk PRIMARY KEY (grupoid, userid),
	CONSTRAINT grupoid_fk FOREIGN KEY (grupoid) REFERENCES public.grupos(id),
	CONSTRAINT userid_fk FOREIGN KEY (userid) REFERENCES public.usuario(email)
);

CREATE TABLE public.mensagem (
	grupoid varchar NOT NULL,
	iduser varchar NOT NULL,
	texto varchar NOT NULL,
	id varchar NOT NULL,
	datahora timestamp NOT NULL,
	CONSTRAINT mensagem_pk PRIMARY KEY (id),
	CONSTRAINT iduser_fk FOREIGN KEY (iduser) REFERENCES public.usuario(email),
	CONSTRAINT mensagem_fk FOREIGN KEY (grupoid) REFERENCES public.grupos(id)
);