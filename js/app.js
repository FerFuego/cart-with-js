/**
 * Custom class to add to mini cart
 * Shop Page - Singleton Pattern
 * @author Fer Catalano
 */
class Mini_Cart {

    cart = null;
    CoursesList = null;
    containerCart = null;
    clearCartBtn = null;
    articlesCart = [];

    constructor() {

        // Singleton Pattern
        if (typeof Mini_Cart.instance === "object") {
            return Mini_Cart.instance;
        }

        Mini_Cart.instance = this;
    }
    
    init() {
        this.cart = document.querySelector('#carrito');
        this.CoursesList = document.querySelector('#lista-cursos');
        this.containerCart = document.querySelector('#lista-carrito tbody');
        this.clearCartBtn = document.querySelector('#vaciar-carrito');
        this.articlesCart = JSON.parse(localStorage.getItem('userCart')) || [];

        // Listeners
        this.loadEventListeners();
    }

    loadEventListeners() {
        // Add course
        this.CoursesList.addEventListener('click', this.addCourse.bind(this) );
        // Delete course
        this.cart.addEventListener('click', this.deleteCourse.bind(this) );
        // Clear cart
        this.clearCartBtn.addEventListener('click', this.clearCart.bind(this) );
        // Cart HTML
        this.cartHTML();
    }

    addCourse(e) {
        if (e.target.classList.contains('agregar-carrito')) {
            const curso = e.target.parentElement.parentElement;
            // Instance Course
            this.readDataCourse(curso);
        }
    }

    readDataCourse(course) {

        // Course info
        const infoCourse = {
            image: course.querySelector('img').src,
            title: course.querySelector('h4').textContent,
            price: course.querySelector('.precio span').textContent,
            id: course.querySelector('a').getAttribute('data-id'),
            quantity: 1
        }

        // Search if course exists
        const existe = this.articlesCart.some( curso => curso.id === infoCourse.id)

        if (existe) {
            // Update quantity
            const courses = this.articlesCart.map( course => {
                if (course.id === infoCourse.id) {
                    course.quantity++;
                    return course;
                } else {
                    return course;
                }
            });
            // Update element into array
            this.updateArticleCart(courses);
        } else {
            // Add element to array
            this.addArticleCart(infoCourse);
        }

        // Add to HTML
        this.cartHTML();
    }

    addArticleCart(infoCourse) {
        // Add element to array
        this.articlesCart = [...this.articlesCart, infoCourse] // Spread Operator
    }

    updateArticleCart(courses) {
        // Update array
        this.articlesCart = [...courses];
    }

    cartHTML() {
        // Clear HTML
        this.clearHtml();

        // Iterate over courses
        this.articlesCart.map( course => {
            const {image, title, price, quantity, id} = course;
            const row = document.createElement('tr');
            
            // Generate template row
            row.innerHTML = `
            <td><img src="${image}" width="100"></td>
            <td>${title}</td>
            <td>${price}</td>
            <td>${quantity}</td>
            <td><a href="#" class="borrar-curso" data-id="${id}">X</a></td>`;
            
            // Append row to table
            this.containerCart.appendChild(row);
        });

        // Synchronize to Local Storage
        this.SyncLocalStorage();
    }

    SyncLocalStorage() {
        let articlesCart = JSON.stringify(this.articlesCart);
        localStorage.setItem('userCart', articlesCart);
    }

    clearHtml() {
        while (this.containerCart.firstChild) {
            this.containerCart.removeChild(this.containerCart.firstChild);
        }
    }

    clearCart() {
        this.clearHtml();
        this.articlesCart = [];
    }

    deleteCourse(e) {
        if (e.target.classList.contains('borrar-curso')) { 
            // Delete Course
            const courseId = e.target.getAttribute('data-id');
            this.articlesCart = this.articlesCart.filter( course => course.id !== courseId );
            // Update HTML
            this.cartHTML();
        }
    }
}

// Load Class
document.addEventListener('DOMContentLoaded', () => {
    const miniCart = new Mini_Cart()
    miniCart.init();
});