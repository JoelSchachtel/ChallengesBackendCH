const fs = require("fs");

class ProductManager {
  constructor(fileName) {
    this.fileName = fileName;
    this.format = "utf-8";
  }

  generateId = async () => {
    const data = await this.getProduct();
    const count = data.length;

    if (count == 0) return 1;

    const lastProduct = data[count - 1];
    const lastID = lastProduct.id;
    const nextID = lastID + 1;

    return nextID;
  };

  addProduct = async (title, description, price, thumbnail, stock, code) => {
    const id = await this.generateId();

    return this.getProduct()
      .then((products) => {
        products.push({
          id,
          title,
          description,
          price,
          thumbnail,
          stock,
          code,
        });
        return products;
      })
      .then((productNew) =>
        fs.promises.writeFile(this.fileName, JSON.stringify(productNew))
      );
  };

  getProductById = async (id) => {
    const data = await this.getProduct();
    const productFound = data.find((product) => product.id === id);
    return (
      productFound ||
      console.log(`¡ERROR! El producto de con ID: ${id} no existe.`)
    );
  };

  getProduct = async () => {
    const product = fs.promises.readFile(this.fileName, this.format);
    return product
      .then((content) => JSON.parse(content))
      .catch((e) => {
        if (e) return [];
      });
  };

  deleteProduct = async (id) => {
    const data = await this.getProduct();
    const deleted = data.find(product => product.id === id);

    if(deleted) {
        const index = data.indexOf(deleted)
        data.splice(index, 1);
        await fs.promises.writeFile(this.fileName, JSON.stringify(data))
        console.log(`El producto ID: ${id} fue eliminado.`);
    }
    else {
        console.log(`No se pudo eliminar el producto con ID: ${id}`);
    }
  }

  updateProduct = async (id) => {
    const data = await this.getProduct();
    const updated = data.find(product = product.id === id);

    updated['title'] = 'El producto fue actualizado.';
    updated['stock'] = 'Ya no contamos con stock de este producto.'

    fs.writeFileSync(this.fileName, JSON.stringify(data))
  }

}


async function run() {
    const manager = new ProductManager('./Desafío 2/fs/products.json')

    // await manager.addProduct('Producto 1', 'Producto de prueba 1', 1500, 'Sin imágen cargada', 10, 'abc123');
    // await manager.addProduct('Producto 2', 'Producto de prueba 2', 2750, 'Sin imágen cargada.', 5, 'ABC124');

    // await manager.deleteProduct(1)

    // await manager.updateProduct(1)

    console.log('Los productos agregados son:');
    console.log(await manager.getProduct());

    // REALIZANDO EL TESTING
    // Se llama al método addProduct y se agrega el objeto con ID aleatorio generado automáticamente que no se repite.

    // await manager.addProduct('Producto prueba', 'Este es un producto de prueba', 200, 'Sin imágen', 25, 'abc123')

    // Se llama al método getProducts y aparece en lista el producto agregado

    //Se llama al método getProductById y se devuelve el producto con el id especificado, si no existe arroja error.

    console.log('Seleccionamos el siguiente producto:');
    console.log(await manager.getProductById(5));





}

run()