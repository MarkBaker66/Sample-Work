//
//  ContentView.swift
//  try2
//
//  Created by Mark Baker on 4/24/22.
//

import SwiftUI
import CoreData

struct ContentView: View {
    @Environment(\.managedObjectContext) private var viewContext
    @State var showNewBottleView: Bool = false
    @State var searchText: String = ""
    @State var isFocused: Bool = false
//key: ​"name"​, ​as​cending: ​true
    @FetchRequest(
        sortDescriptors: [NSSortDescriptor(keyPath: \Bottle.name, ascending: true)],
        animation: .default)
    
    
    private var items: FetchedResults<Bottle>

    var body: some View {
        let filteredPeople = items.filter {

            searchText.isEmpty || ($0.name!.lowercased().prefix(searchText.count) == searchText.lowercased())

        }
        
            HStack {
                TextField("Search", text: $searchText)
                    .frame(height: 30)
                    .padding(10)
                    .padding(.horizontal, 25)
                    .background(Color(.systemGray6))
                    .cornerRadius(8)
                    .overlay(
                        HStack {
                            Image(systemName: "magnifyingglass")
                                .frame(minWidth: 0, maxWidth: .infinity, alignment: .leading)
                                .padding(.leading, 8)
                            if self.isFocused {
                                                Button(action: {
                                                    self.searchText = ""
                                                }) {
                                                    Image(systemName: "multiply.circle.fill")
                                                        .foregroundColor(.gray)
                                                        .padding(.trailing, 8)
                                                }
                                            }
                        }
                    )
                    .onTapGesture {
                                self.isFocused = true
                            }
                if isFocused {
                        Button(action: {
                        
                            self.isFocused = false
                            self.searchText = ""
                     UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)

                        }) {
                            Text("Cancel")
                        }
                        .padding(.trailing, 10)
                        .transition(.move(edge: .trailing))
                        .animation(.default)
                    }
                
            }
            .padding(.horizontal, 15)
            .padding(.top, 15)
            
            let filteredPeople = items.filter {

                searchText.isEmpty || ($0.name!.lowercased().prefix(searchText.count) == searchText.lowercased())

                }
        
        NavigationView {
            List {
                     ForEach (filteredPeople) { bottle in
                         NavigationLink(destination: BottlePageView(bottle: bottle)) {
                             
                                  BottleTileView(bottle: bottle)
                                 
                         }
                             .contextMenu {
                                             Button(action: {
                                                 delete(items: bottle)
                                             }) {
                                                 Text("Delete")
                                             }
                                         }
                     }
                 
            }
         
                     .navigationTitle("My Bourbon")
                     .sheet(isPresented: $showNewBottleView) {
                                         NewBottleView()
                                     }
                     .navigationBarItems(trailing:
                         Button (action: {
                         showNewBottleView.toggle()
                         }) {
                             Image(systemName: "plus")
                         }
                     )
                
        }
    }
         
            
        
    
    func delete (items: Bottle) {

        viewContext.delete(items)
        do {
            try viewContext.save()
        } catch {
            print(error.localizedDescription)
        }
            
    }
}

private let itemFormatter: DateFormatter = {
    let formatter = DateFormatter()
    formatter.dateStyle = .short
    formatter.timeStyle = .medium
    return formatter
}()

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView().environment(\.managedObjectContext, PersistenceController.preview.container.viewContext)
    }
}


struct NewBottleView: View {
    
    @Environment(\.managedObjectContext) private var viewContext
    @Environment (\.presentationMode) var presentationMode

    @State var name: String = ""

    var body: some View {

        VStack (spacing: 20) {
        
            Text("Add a New Bottle:")
                .font(.headline)
            TextField("Enter Name", text: $name)
                .padding(20)
                .background(Color(.systemGray6))
                .cornerRadius(8)
            
            Button (action: {
                            guard self.name != "" else {
                                return
                            }
                            let newBottle = Bottle(context: viewContext)
                            newBottle.name = self.name
                            newBottle.id = UUID()
                            do {
                                try viewContext.save()
                                presentationMode.wrappedValue.dismiss()
                            } catch {
                                print(error.localizedDescription)
                            }
                        }) {
                            Text("Save")
                        }
        }
        .padding()
    
    }
}


struct BottleTileView: View {
 
@ObservedObject var bottle: Bottle
 
var body: some View {

    HStack {
    
        Text(bottle.name ?? "<no_name>")
            .font(.custom("Roboto-Bold", size: 20))
            .foregroundColor(Color.black)
 
      }
    .padding()
   }
}


struct BottlePageView:View {
 
    @ObservedObject var bottle: Bottle
    @State var showNewBottleInfoView: Bool = false
 
    var body: some View {
        List {
            ForEach (bottle.transactions?.array as! [Transaction]) { transaction in
                        
                            VStack (alignment: .leading, spacing: 7) {
                              
                                Text("Comment: ") +  Text(transaction.comment ?? "<no_comment>")
                                Text("Amount: ") +  Text("\(transaction.amount)" as String)
                                Text("Distillery: ") + Text(transaction.distillery ?? "<no_name>")
                            }
               
                    }
                }
        .navigationBarTitle(bottle.name ?? "<no_name>")
                    .navigationBarItems(trailing:
                        Button (action: {
                            showNewBottleInfoView.toggle()
                        }) {
                            Image(systemName: "plus")
                        }
                    )
                    .sheet(isPresented: $showNewBottleInfoView) {
                        NewBottleInfoView(bottle: bottle)
                    }
            }
    }
        



struct NewBottleInfoView: View {

    @Environment(\.managedObjectContext) private var viewContext
    @Environment (\.presentationMode) var presentationMode

    @State var amount: String = ""
    @State var distillery: String = ""
    @State var comment: String = ""
    var bottle: Bottle

    var body: some View {

        VStack (spacing: 20) {
        
            Form {
        
                    TextField("Enter Amount", text: $amount)
                    TextField("Enter Distillery", text: $distillery)
                    TextField("Enter Comments", text: $comment)
                    Button (action: {
                        guard self.amount != "" && self.distillery != "" else {
                            return
                        }
                        let transaction = Transaction(context: viewContext)
                        let formatter = NumberFormatter()
                        formatter.numberStyle = .decimal
                        let nsNumber = formatter.number(from: self.amount)
                        transaction.amount = nsNumber!.floatValue
                        transaction.bottle = bottle
                        transaction.distillery = self.distillery
                        transaction.comment = self.comment
                        transaction.id = UUID()
                        do {
                            try viewContext.save()
                            presentationMode.wrappedValue.dismiss()
                        } catch {
                            print(error.localizedDescription)
                        }
                    }) {
                        Text("Save")
                    }
                 
            }
        }
        .padding()
        .navigationBarTitle("Add New Info")
    
    }
}
