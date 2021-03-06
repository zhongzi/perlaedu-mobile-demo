const Home = () =>
  import(/* webpackChunkName: "media" */ "@/view/media/Home.vue");

const Merchant = () =>
  import(/* webpackChunkName: "media" */ "@/view/media/Merchant.vue");
const Album = () =>
  import(/* webpackChunkName: "media" */ "@/view/media/Album.vue");
const AlbumPlayer = () =>
  import(/* webpackChunkName: "media" */ "@/view/media/AlbumPlayer.vue");
const AlbumSearch = () =>
  import(/* webpackChunkName: "media" */ "@/view/media/AlbumSearch.vue");

const PhotoDetail = () =>
  import(/* webpackChunkName: "media" */ "@/view/media/PhotoDetail.vue");
const PhotoEditing = () =>
  import(/* webpackChunkName: "media" */ "@/view/media/PhotoEditing.vue");

const mediaRoutes: any = [
  {
    path: "/media",
    component: Home,
    redirect: {
      name: "mediaMerchant",
    },
    children: [
      {
        path: "merchant",
        name: "mediaMerchant",
        component: Merchant,
        meta: {
          title: "相册中心",
          keepAlive: true,
          requireAuth: true,
          requireManager: true,
          hideCopyright: true,
        },
      },
      {
        path: "albums/:albumId",
        name: "mediaAlbum",
        component: Album,
        meta: {
          title: "相册",
          keepAlive: true,
          requireAuth: true,
          hideCopyright: true,
        },
      },
      {
        path: "album-player",
        name: "mediaAlbumPlayer",
        component: AlbumPlayer,
        meta: {
          title: "画廊",
          hideCopyright: true,
        },
      },
      {
        path: "albums-search",
        name: "mediaAlbumsSearch",
        component: AlbumSearch,
        meta: {
          title: "搜索相册",
          keepAlive: true,
          requireAuth: true,
          hideCopyright: true,
        },
      },
      {
        path: "photo/:mediaId",
        name: "mediaPhoto",
        component: PhotoDetail,
        meta: {
          title: "作品详情",
          requireAuth: true,
          copyrightStyle: {
            marginBottom: "70px",
          },
        },
      },
      {
        path: "photo/:mediaId/editing",
        name: "mediaPhotoEditing",
        component: PhotoEditing,
        meta: {
          title: "编辑作品",
          requireAuth: true,
          hideCopyright: true,
        },
      },
    ],
  },
];

export default mediaRoutes;
