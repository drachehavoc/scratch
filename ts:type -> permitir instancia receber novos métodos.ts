type BaseMais<T, Opts extends {}> = T & {
	[K in string]: K extends keyof T ? T[K] : ((opts: Opts) => any) | undefined;
}

const canInstantiateWithNew = Symbol()

class Base {
	static [canInstantiateWithNew] = false

	private constructor() {
		if (!this.constructor[canInstantiateWithNew])
			throw "instancie a classe com o método estico create"
	}

	static create<Opts extends {}>() {
		this[canInstantiateWithNew] = true
		const obj = new this
		this[canInstantiateWithNew] = false
		return obj as BaseMais<Base, Opts> // magica do casting
	}

	check(): true { 
		return true 
	}
}

// Cria instância
const v = Base.create<{ max?: number }>()

// Deve funcionar de boas
v.minhaRegra = ({ max }) => null!
v.minhaRegra({ max: 100 })

// Por contas do `| undefined´ na definição do tipo BaseMais, 
// regraInexistente é de fato inexistente
v.regraInexistente() 

// Erro de tipo, pq check foi definido na classe e portanto é do tipo () => true
v.check = () => false
