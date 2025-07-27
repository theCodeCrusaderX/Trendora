import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProductFilter from "@/components/shopping-view/ProductFilter";
import { ArrowUpDownIcon } from "lucide-react";
import { sortOptions } from "@/config";
import ShoppingProductTile from "../../components/shopping-view/ShoppingProductTile";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails, getFilteredProduct } from "@/store/shop/product-slice";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ShoppingProductDetail from "../../components/shopping-view/ShoppingProductDetail";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";


//TODO:  debugg
function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  console.log(queryParams, "queryParams");

  return queryParams.join("&");
}



function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { user } = useSelector((state) => state.auth);
  const [sort, setSort] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const categorySearchParam = searchParams.get("category");

  // console.log('005',productList);

  const {cartItems} = useSelector(state => (state.shopCart))

  const {toast} = useToast();

  function handleSort(value) {
    setSort(value);
  }

  const [filters, setFilters] = useState({});

  function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    console.log("cpyFilters", cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters)); //setting filter to sessionStorage
  }

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  
  console.log(2882,categorySearchParam);
  
  // setting defaluly val to sort and filters on page load
  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {}); //fetching and setting filter from sessionStorage
  }, [categorySearchParam]);


  console.log(searchParams);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);

  function handleGetProductDetails(getCurrentProductId) {
    // console.log(id);
    dispatch(fetchProductDetails(getCurrentProductId));
    
  }

  function handleAddtoCart(getCurrentProductId, totalStock) {
    // console.log("total stock we have :: ",totalStock);
    // console.log("product id is  :: ", id);
    // console.log("current user is :: ", user);


    // console.log(cartItems);
    let getCartItems = cartItems.items || [];
    console.log('889',getCartItems);

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }

    dispatch(addToCart({ userId: user?._id, productId: getCurrentProductId, quantity: 1 })).then(
      (data) => {
        dispatch(fetchCartItems(user?._id));
        toast({
          title: "Product Added successfully :)",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    );
  }

  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(getFilteredProduct({ filterParams: filters, sortParams: sort }));
  }, [dispatch, sort, filters]);

  useEffect(() => {
    dispatch(getFilteredProduct());
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList?.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {productList && productList.length > 0
            ? productList.map((productItem) => (
                <ShoppingProductTile
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
            : null}
        </div>
      </div>
      <ShoppingProductDetail
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingListing;
