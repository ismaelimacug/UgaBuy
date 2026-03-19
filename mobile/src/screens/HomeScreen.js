import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../services/api';

const {width} = Dimensions.get('window');
const PRIMARY_COLOR = '#00C853';

const HomeScreen = ({navigation}) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.get('/products/featured');
      setFeaturedProducts(response.data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  const categories = [
    {name: 'Smartphones', icon: 'smartphone'},
    {name: 'Laptops', icon: 'laptop'},
    {name: 'Audio', icon: 'headset'},
    {name: 'Wearables', icon: 'watch'},
  ];

  const formatPrice = price => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: 'https://customer-assets.emergentagent.com/job_techstore-ug/artifacts/kju79vt4_ugabuy%20logo.jpg',
          }}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Uganda's Premier{' \n'}Tech Marketplace</Text>
        <Text style={styles.heroSubtitle}>
          Quality gadgets at unbeatable prices
        </Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate('ProductsTab')}>
          <Text style={styles.shopButtonText}>Shop Now</Text>
          <Icon name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shop by Category</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryCard}
              onPress={() =>
                navigation.navigate('ProductsTab', {category: category.name})
              }>
              <Icon name={category.icon} size={40} color={PRIMARY_COLOR} />
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {featuredProducts.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Deals</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ProductsTab')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredProducts.map(product => (
              <TouchableOpacity
                key={product.product_id}
                style={styles.productCard}
                onPress={() =>
                  navigation.navigate('ProductDetail', {productId: product.product_id})
                }>
                <Image
                  source={{uri: product.images[0] || 'https://via.placeholder.com/150'}}
                  style={styles.productImage}
                />
                <Text style={styles.productBrand}>{product.brand}</Text>
                <Text style={styles.productName} numberOfLines={2}>
                  {product.name}
                </Text>
                <Text style={styles.productPrice}>
                  {formatPrice(product.price)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.featuresGrid}>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>📦</Text>
            <Text style={styles.featureTitle}>Fast Delivery</Text>
            <Text style={styles.featureText}>Across Uganda</Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureTitle}>Verified Products</Text>
            <Text style={styles.featureText}>100% Authentic</Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>💳</Text>
            <Text style={styles.featureTitle}>Secure Payment</Text>
            <Text style={styles.featureText}>Mobile Money & Card</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logo: {
    width: 120,
    height: 60,
  },
  heroSection: {
    padding: 30,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  shopButton: {
    flexDirection: 'row',
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 15,
  },
  viewAllText: {
    color: PRIMARY_COLOR,
    fontSize: 14,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 60) / 2,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  productCard: {
    width: 160,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#f5f5f5',
  },
  productBrand: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    marginHorizontal: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginHorizontal: 10,
    marginTop: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    margin: 10,
  },
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featureCard: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default HomeScreen;