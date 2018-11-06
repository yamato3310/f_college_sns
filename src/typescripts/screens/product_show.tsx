import * as React from 'react';
import { ProductService } from '../services';
import { RouteComponentProps, Link} from 'react-router-dom';
import Screen from './screen';
import {Product} from '../entities';
import { Loading, Icon } from '../components';
import { PhotoService } from '../services/photo';

interface Props extends RouteComponentProps<{id: number}> {}

interface State {
    product: Product | null;
    activeImagePath?: string;
}

export class ProductShow extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            product: null,
        };
    }

    public async componentDidMount() {
        const product = await ProductService.get(this.props.match.params.id);
        this.setState({ product });
        this.setState({ activeImagePath: product.imageURLPath });
    }

    public render() {

        if (this.state.product === null ) return ( <Loading />);

        // TODO activeIMGのClass周りの動的な書き換え
        const subImages = ['01.png', '02.png', '11.png', '17.png'].map((img, index) => {
            const path = PhotoService.getS3PhotoPath(img, 'products/sample');
            return (
                <p key={index} className='img-container cover' onClick={this.changeActiveImage}>
                    <img className='img non-active' src={path} width={100} height={100} />
                </p>
            );
        });

        const product = this.state.product;

        subImages.unshift(
            <p className='img-container' onClick={this.changeActiveImage}>
                <img className='img active' src={product.imageURLPath} width={100} height={100} />
            </p>);

        return (
            <Screen name='product-show' showBackButton>
                {/*
                    <h1 className='title'>
                        {this.state.product.title}
                    </h1>
                */}
                <div className='image-container'>
                    <img
                        className='product-img'
                        src={this.state.activeImagePath}
                    />
                    <div className='sub-images-container d-flex'>
                        {subImages}
                    </div>
                </div>

                <div className='product-container'>
                    <div className='creators'>
                        <div className='main-creator text'>
                            <div className='d-flex justify-content-around align-items-center'>
                                <img
                                    // FIXME S3にuserの場所作る
                                    src='/assets/images/users/yamashitamizuki_prof.jpg'
                                    className='owner-img'
                                />
                                <div className='main-creator'>
                                    <p className='subject'>
                                        ブライダル科 １年
                                        <span className='name'>
                                            山田花子
                                        </span>
                                    </p>

                                    <p className='concept'>
                                        作品コンセプト
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='concept'>
                        <h2>Creator Comment</h2>
                        <p className='text'>
                        ドレスの薔薇っぽいところをがんばりました。 薔薇を薔薇っぽく見せるのに苦労しました。 すごくがんばったのでよろしくお願いします。
                        </p>
                    </div>
                </div>

                <div className='bottom'>
                    <button
                        className='vote-button'
                    >
                        <Icon name='crown'/>
                        <span>投票する</span>
                    </button>
                </div>

                {/*
                    <Link to='/products' className='link btn btn-sm mt-3'>
                        '/products'へのリンク
                    </Link>
                */}
            </Screen>
        );
    }

    private changeActiveImage = (e: any) => {
        const clickedImg = e.target;

        document.querySelectorAll('.sub-images-container .active').forEach(d => {
            d.classList.remove('active');
            if (d.parentElement) d.parentElement.classList.add('cover');
        });

        clickedImg.classList.add('active');
        e.currentTarget.classList.remove('cover');
        this.setState({ activeImagePath: clickedImg.src });
    }
}
