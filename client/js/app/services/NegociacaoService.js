class NegociacaoService {

	constructor() {

		this._http = new HttpService();
	}

	obterNegociacoes() {

        return Promise.all([
        
            this.obterNegociacoesDaSemana(),
            this.obterNegociacoesDaSemanaAnterior(),
            this.obterNegociacoesDaSemanaRetrasada()
        ]).then(periodos => {

            let negociacoes = periodos
                .reduce((dados, periodo) => dados.concat(periodo), []);

            return negociacoes;

        }).catch(erro => {
        
            throw new Error(erro);
        });
    }

	obterNegociacoesDaSemana() {

		return this._http
				.get('negociacoes/semana')
				.then(negociacoes => {
					return negociacoes.map(objeto => 
								new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
				})
				.catch(error => {
					console.log(error);
					throw new Error('Não foi possível obter as negociações da semana');
				});
	}

	obterNegociacoesDaSemanaAnterior() {

		return this._http
				.get('negociacoes/anterior')
				.then(negociacoes => {
					return negociacoes.map(objeto => 
								new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
				})
				.catch(error => {
					console.log(error);
					throw new Error('Não foi possível obter as negociacões da semana anterior');
				});
	}

	obterNegociacoesDaSemanaRetrasada() {

		return this._http
				.get('negociacoes/retrasada')
				.then(negociacoes => {
					return negociacoes.map(objeto => 
								new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
				})
				.catch(error => {
					console.log(error);
					throw new Error('Não foi possível obter as negociações da semana retrasada');
				});
	}

	cadastra(negociacao) {

        return ConnectionFactory
            .getConnection()
            .then(conexao => new NegociacaoDao(conexao))
            .then(dao => dao.adiciona(negociacao))
            .then(() => 'Negociação cadastrada com sucesso')
            .catch(erro => {
            	console.log(erro);
                throw new Error("Não foi possível adicionar a negociação")
            });
    }

    lista() {

	  	return ConnectionFactory
	          .getConnection()
	          .then(connection => new NegociacaoDao(connection))
	          .then(dao => dao.listaTodos())
	          .catch(erro => {
	              console.log(erro);
	              throw new Error('Não foi possível obter as negociações')
	          });
	}

	esvazia() {

	    return ConnectionFactory
	        .getConnection()
	        .then(connection => new NegociacaoDao(connection))
	        .then(dao => dao.apagaTodos())
	        .then(() => 'Negociações apagadas com sucesso')
	        .catch(erro => {
	              console.log(erro);
	              throw new Error('Não foi possível apagar as negociações')
	        });
	}

	importa(listaAtual) {

       return this.obterNegociacoes()
           .then(negociacoes =>
               negociacoes.filter(negociacao =>
                   !listaAtual.some(negociacaoExistente =>
                       negociacao.isEquals(negociacaoExistente)))
           )
           .catch(erro => {
               console.log(erro);
               throw new Error("Não foi possível importar as negociações");
           });
   }
}