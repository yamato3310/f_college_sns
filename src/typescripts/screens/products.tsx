import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ProductService, ProductTypes} from '../services';
import { ProductList } from '../entities';
import Screen from './screen';
import { Product } from '../components/product';
import { Tab } from '../components/tab';
import { ApplicationManager } from '../application_manager';

interface Props extends RouteComponentProps<{}> {}

interface State {
    products: ProductTypes;
    activeCategory: 'beauty' | 'fashion';
}

export class Products extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            products: { fashion: [], beauty: [] },
            activeCategory: ApplicationManager.instance.activeCategory,
        };
    }

    public changeActiveCategory = (e: React.MouseEvent) => {
        const activeCategory = this.state.activeCategory;
        if (e.currentTarget.classList.contains(`${activeCategory}-active`)) return;

        const category = activeCategory === 'fashion' ? 'beauty' : 'fashion';
        this.setState({ activeCategory: category });
        ApplicationManager.instance.changeActiveCategory(category);
    }

    public async componentDidMount() {
        const products = await ProductService.getAll();
        this.setState({ products });
    }

    public render() {
        const fashionProducts = this.state.products.fashion.map((product: ProductList) => (<Product key={product.productId} product={product} />));
        const beautyProducts = this.state.products.beauty.map((product: ProductList) => (<Product key={product.productId} product={product} />));

        return (
            <Screen name='products'>
                <div className='product-index'>
                    {this.state.activeCategory === 'fashion' ? fashionProducts : beautyProducts}
                </div>

                <footer className='d-flex align-items-center'>
                    <Tab
                        stateChange={this.changeActiveCategory}
                        value={'ファッション部門'}
                        class={`${this.state.activeCategory === 'fashion' ? 'fashion-active' : 'fashion'}`}
                    />
                    <Tab
                        stateChange={this.changeActiveCategory}
                        value={'ビューティー部門'}
                        class={`${this.state.activeCategory === 'beauty' ? 'beauty-active' : 'beauty'}`}
                    />
                </footer>
            </Screen>
        );
    }
}
