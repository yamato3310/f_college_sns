import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { ProductService } from '../services';
import Screen from './screen';
import { Product } from '../entities';
import { Photo } from '../components/photo';
import { Tab } from '../components/tab';

interface Props extends RouteComponentProps<{}> {}

interface State {
    products: Product[];
    activeCategory: 'beauty' | 'fashion';
}

export class Products extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            products: [],
            activeCategory: 'fashion',
        };
    }

    public changeActiveCategory = (e: React.MouseEvent<HTMLElement>) => {
        const activeCategory = this.state.activeCategory;
        if (e.target.className.includes(`${activeCategory}-active`)) return;

        const category = activeCategory === 'fashion' ? 'beauty' : 'fashion';
        this.setState({activeCategory: category});
    }

    public async componentDidMount() {
        const products = await ProductService.getAll();
        this.setState({products});
    }

    public render() {
        // const products = this.state.products.filter(p => p.beauty).map( p => {
        const products = this.state.products.map( p => {
            {/*
                FIXME
                ↓でゴニョごにょしている箇所をコンポーネントにしたい
                <Product key={p.id} product={p} /> のように呼び出して
                同様の処理になるようなコンポーネントを作って欲しい
            */}

            const owner = p.owner;
 //           console.log(p);
 //           console.log(owner);
            return (
                <div key={p.id} className='product d-flex flex-column'>
                    <img src={p.imageURLPath} className='product-img'/>
                    {/*
                        <p className='concept'>{p.concept}</p>
                        <p className='owner'>{owner.name}</p>
                        <p>{owner.subject}</p>
                        <img src={owner.profilePhotoPath} className='profile_image'/>
                    */}
                </div>
            );
        });

        return (
            <Screen name='products'>
                <Link to='/products' className='link btn btn-sm mt-3'>
                    '/products'へのリンク
                </Link>
                <div className='product-index d-flex align-content-center flex-wrap'>
                    {products}
                </div>
                {/*
                    <div className='d-flex flex-wrap'>
                        <Photo photoName={'1_Br2A_SHIOYA_Konatsu'} dirName={'products'} />
                        <Photo photoName={'3_Br2A_MARUYAMA_Shiori'} dirName={'products'} />
                        <Photo photoName={'4_Br2B_OONUKI_Erii'} dirName={'products'} />
                        <Photo photoName={'6_FLD2_KITAZAWA_Saaya'} dirName={'products'} />
                        <Photo photoName={'9_FB1B_MIYAUCHI_Haruka'} dirName={'products'} />
                        <Photo photoName={'12_FB2_MURAYAMA_Sakura'} dirName={'products'} />
                        <Photo photoName={'14_FLD1_OKUMA_Aoi'} dirName={'products'} />
                        <Photo photoName={'17_FLD1_Yamauchi_Ryo'} dirName={'products'} />
                        <Photo photoName={'22_FLD2_ISHIDA_Hinata'} dirName={'products'} />
                        <Photo photoName={'28_FLD3_OGURA_Mariko'} dirName={'products'} />
                    </div>
                */}

                <footer className='d-flex flex-row tab-bar'>
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
